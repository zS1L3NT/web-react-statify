import { afterEach, beforeEach, expect, mock, test } from "bun:test"
import { createHash } from "node:crypto"
import { createElement } from "react"
import { Provider } from "react-redux"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { act, create } from "react-test-renderer"

import { configureStore } from "@reduxjs/toolkit"

mock.module("@mui/material", () => ({
	Box: "div",
	Button: "button",
	LinearProgress: "progress",
	Typography: "p",
}))
mock.module("@mui/icons-material/CloudOff", () => ({ default: () => null }))
mock.module("react-use-is-online", () => ({
	useIsOnline: () => ({ isOnline: true, isOffline: false }),
}))

const memoryStorage = () => {
	const values = new Map<string, string>()
	return {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => values.set(key, value),
		removeItem: (key: string) => values.delete(key),
		clear: () => values.clear(),
	}
}

Object.assign(globalThis, {
	localStorage: memoryStorage(),
	sessionStorage: memoryStorage(),
	window: { location: { href: "", origin: "https://statify.zectan.com" } },
})

const { default: Login } = await import("../src/pages/Login")
const { default: tokenReducer } = await import("../src/slices/TokenSlice")
const { default: Logout } = await import("../src/pages/Logout")
const auth = await import("../src/utils/spotifyAuth")
const originalFetch = globalThis.fetch
const roots: ReturnType<typeof create>[] = []

const Path = () => createElement("p", { id: "path" }, useLocation().pathname)

const renderPage = async (path: string, token: string | null = null) => {
	const store = configureStore({ reducer: { token: tokenReducer }, preloadedState: { token } })
	let root: ReturnType<typeof create>
	await act(async () => {
		root = create(
			createElement(
				Provider,
				{ store },
				createElement(
					MemoryRouter,
					{ initialEntries: [path] },
					createElement(Path),
					createElement(
						Routes,
						null,
						createElement(Route, { path: "/login", element: createElement(Login) }),
						createElement(Route, { path: "/logout", element: createElement(Logout) }),
						createElement(Route, { path: "*", element: createElement("div") }),
					),
				),
			),
		)
		await new Promise(resolve => setTimeout(resolve, 10))
	})
	roots.push(root!)
	return { root: root!, store }
}

afterEach(() => {
	for (const root of roots.splice(0)) root.unmount()
	globalThis.fetch = originalFetch
})

beforeEach(() => {
	localStorage.clear()
	sessionStorage.clear()
	window.location.href = ""
})

test("login starts Spotify authorization code with an S256 PKCE challenge", async () => {
	await renderPage("/login")
	const url = new URL(window.location.href)
	expect(url.origin + url.pathname).toBe("https://accounts.spotify.com/authorize")
	expect(url.searchParams.get("response_type")).toBe("code")
	expect(url.searchParams.get("code_challenge_method")).toBe("S256")
	expect(url.searchParams.get("code_challenge")).toMatch(/^[A-Za-z0-9_-]{43}$/)
	expect(url.searchParams.get("redirect_uri")).toBe("https://statify.zectan.com/login")
	expect(url.searchParams.get("state")).toBeTruthy()
	const pending = JSON.parse(sessionStorage.getItem("spotify_login")!)
	expect(url.searchParams.get("code_challenge")).toBe(
		createHash("sha256").update(pending.verifier).digest("base64url"),
	)
})

test("callback exchanges the code, saves a reloadable session, and returns to the requested page", async () => {
	const url = new URL(await auth.createAuthorizationUrl())
	const pending = JSON.parse(sessionStorage.getItem("spotify_login")!)
	sessionStorage.setItem("redirect", "/top-tracks/short-term")
	const fetchToken = mock(async () =>
		Response.json({
			access_token: "access",
			refresh_token: "refresh",
			expires_in: 3600,
		}),
	)
	globalThis.fetch = fetchToken as unknown as typeof fetch
	const { store, root } = await renderPage(
		`/login?code=auth-code&state=${url.searchParams.get("state")}`,
	)
	expect(fetchToken).toHaveBeenCalledTimes(1)
	const [endpoint, request] = fetchToken.mock.calls[0] as unknown as [string, RequestInit]
	expect(endpoint).toBe("https://accounts.spotify.com/api/token")
	expect(request.method).toBe("POST")
	expect(Object.fromEntries(request.body as URLSearchParams)).toEqual({
		client_id: "042bace248d040d79bffb1e86f0c29c1",
		grant_type: "authorization_code",
		code: "auth-code",
		redirect_uri: "https://statify.zectan.com/login",
		code_verifier: pending.verifier,
	})
	expect(store.getState().token).toBe("access")
	expect(auth.getStoredAccessToken()).toBe("access")
	expect(JSON.parse(localStorage.getItem("spotify_session")!).refreshToken).toBe("refresh")
	expect(sessionStorage.getItem("spotify_login")).toBeNull()
	expect(sessionStorage.getItem("redirect")).toBeNull()
	expect(root.root.findByProps({ id: "path" }).children).toEqual(["/top-tracks/short-term"])
})

test("denied authorization shows a retry link without restarting login", async () => {
	const url = new URL(await auth.createAuthorizationUrl())
	const fetchToken = mock()
	globalThis.fetch = fetchToken as unknown as typeof fetch
	const { root } = await renderPage(
		`/login?error=access_denied&state=${url.searchParams.get("state")}`,
	)
	expect(root.root.findByProps({ role: "alert" }).children.join("")).toContain("cancelled")
	expect(root.root.findByProps({ href: "/login" })).toBeTruthy()
	expect(fetchToken).not.toHaveBeenCalled()
	expect(window.location.href).toBe("")
})

test("callback with mismatched state does not exchange a token", async () => {
	await auth.createAuthorizationUrl()
	const fetchToken = mock()
	globalThis.fetch = fetchToken as unknown as typeof fetch
	const { root } = await renderPage("/login?code=auth-code&state=wrong")
	expect(root.root.findByProps({ role: "alert" }).children.join("")).toContain("verified")
	expect(fetchToken).not.toHaveBeenCalled()
})

test("parallel API requests refresh an expired session once and retain an unchanged refresh token", async () => {
	localStorage.setItem(
		"spotify_session",
		JSON.stringify({
			accessToken: "expired",
			refreshToken: "refresh",
			expiresAt: Date.now() - 1000,
		}),
	)
	const fetchToken = mock(async () =>
		Response.json({ access_token: "renewed", expires_in: 3600 }),
	)
	globalThis.fetch = fetchToken as unknown as typeof fetch
	expect(await Promise.all([auth.getAccessToken(), auth.getAccessToken()])).toEqual([
		"renewed",
		"renewed",
	])
	expect(fetchToken).toHaveBeenCalledTimes(1)
	const [, request] = fetchToken.mock.calls[0] as unknown as [string, RequestInit]
	expect(Object.fromEntries(request.body as URLSearchParams)).toMatchObject({
		grant_type: "refresh_token",
		refresh_token: "refresh",
	})
	expect(JSON.parse(localStorage.getItem("spotify_session")!).refreshToken).toBe("refresh")
	expect(await auth.getAccessToken()).toBe("renewed")
	expect(fetchToken).toHaveBeenCalledTimes(1)
})

test("rejected refresh clears the session so signing in again is possible", async () => {
	localStorage.setItem(
		"spotify_session",
		JSON.stringify({
			accessToken: "expired",
			refreshToken: "revoked",
			expiresAt: 0,
		}),
	)
	globalThis.fetch = mock(
		async () => new Response("", { status: 400 }),
	) as unknown as typeof fetch
	await expect(auth.getAccessToken()).rejects.toThrow("sign in again")
	expect(auth.getStoredAccessToken()).toBeNull()
})

test("logout clears both the persisted session and Redux token", async () => {
	localStorage.setItem(
		"spotify_session",
		JSON.stringify({
			accessToken: "access",
			refreshToken: "refresh",
			expiresAt: Date.now() + 3600_000,
		}),
	)
	localStorage.setItem("token", "legacy")
	const { store, root } = await renderPage("/logout", "access")
	expect(store.getState().token).toBeNull()
	expect(auth.getStoredAccessToken()).toBeNull()
	expect(localStorage.getItem("token")).toBeNull()
	expect(root.root.findByProps({ id: "path" }).children).toEqual(["/"])
})

test("a Spotify API 401 refreshes the token and retries the original request", async () => {
	localStorage.setItem(
		"spotify_session",
		JSON.stringify({
			accessToken: "rejected",
			refreshToken: "refresh",
			expiresAt: Date.now() + 3600_000,
		}),
	)
	const fetchToken = mock(async () =>
		Response.json({ access_token: "renewed", expires_in: 3600 }),
	)
	globalThis.fetch = fetchToken as unknown as typeof fetch
	const requests: { url: string; authorization?: string }[] = []
	const originalXHR = globalThis.XMLHttpRequest
	Object.assign(window, { Promise })
	Object.assign(globalThis, {
		XMLHttpRequest: class {
			status = 0
			readyState = 0
			responseText = ""
			onreadystatechange = () => {}
			request = { url: "", authorization: "" }
			open(_method: string, url: string) {
				this.request.url = url
			}
			setRequestHeader(name: string, value: string) {
				if (name === "Authorization") this.request.authorization = value
			}
			send() {
				requests.push(this.request)
				this.status = requests.length === 1 ? 401 : 200
				this.readyState = 4
				this.responseText = JSON.stringify(
					this.status === 200 ? { items: [] } : { error: { status: 401 } },
				)
				this.onreadystatechange()
			}
		},
	})
	try {
		const { default: query } = await import("../src/utils/spotifyApiQuery")
		const dispatch = mock()
		const result = await query(
			["getMyTopTracks", [{ limit: 50 }], "rejected"],
			{ dispatch } as any,
			{},
		)
		expect(result).toEqual({ data: { items: [] } })
		expect(requests).toEqual([
			{
				url: "https://api.spotify.com/v1/me/top/tracks?limit=50",
				authorization: "Bearer rejected",
			},
			{
				url: "https://api.spotify.com/v1/me/top/tracks?limit=50",
				authorization: "Bearer renewed",
			},
		])
		expect(fetchToken).toHaveBeenCalledTimes(1)
		expect(dispatch.mock.calls).toContainEqual([{ type: "token/setToken", payload: "renewed" }])
	} finally {
		globalThis.XMLHttpRequest = originalXHR
	}
})
