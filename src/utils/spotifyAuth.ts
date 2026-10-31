const clientId = "042bace248d040d79bffb1e86f0c29c1"
const scopes =
	"user-top-read user-read-recently-played user-follow-read user-follow-modify user-library-read user-library-modify"
const sessionKey = "spotify_session"
const loginKey = "spotify_login"

type Session = {
	accessToken: string
	refreshToken: string
	expiresAt: number
}

type TokenResponse = {
	access_token: string
	refresh_token?: string
	expires_in: number
}

const randomString = () =>
	Array.from(crypto.getRandomValues(new Uint8Array(32)), byte =>
		byte.toString(16).padStart(2, "0"),
	).join("")

const readSession = (): Session | null => {
	try {
		return JSON.parse(localStorage.getItem(sessionKey) || "null")
	} catch {
		localStorage.removeItem(sessionKey)
		return null
	}
}

export const getStoredAccessToken = () => {
	// Implicit-flow tokens have no expiry or refresh token. Sign in again once.
	localStorage.removeItem("token")
	return readSession()?.accessToken ?? null
}

export const clearSpotifySession = () => {
	localStorage.removeItem(sessionKey)
	localStorage.removeItem("token")
	sessionStorage.removeItem(loginKey)
}

export const createAuthorizationUrl = async () => {
	const verifier = randomString()
	const state = randomString()
	const redirectUri = window.location.origin + "/login"
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))
	const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "")

	sessionStorage.setItem(loginKey, JSON.stringify({ verifier, state, redirectUri }))
	return (
		"https://accounts.spotify.com/authorize?" +
		new URLSearchParams({
			client_id: clientId,
			response_type: "code",
			redirect_uri: redirectUri,
			scope: scopes,
			state,
			code_challenge_method: "S256",
			code_challenge: challenge,
		})
	)
}

const requestToken = async (params: Record<string, string>, refreshToken?: string) => {
	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ client_id: clientId, ...params }),
	})
	if (!response.ok) {
		if (response.status === 400 || response.status === 401) clearSpotifySession()
		throw new Error("Spotify sign-in expired or failed. Please sign in again.")
	}
	const data = (await response.json()) as TokenResponse
	const session: Session = {
		accessToken: data.access_token,
		refreshToken: data.refresh_token ?? refreshToken!,
		expiresAt: Date.now() + data.expires_in * 1000,
	}
	localStorage.setItem(sessionKey, JSON.stringify(session))
	return session.accessToken
}

export const completeAuthorization = async (search: string) => {
	const params = new URLSearchParams(search)
	const pending = JSON.parse(sessionStorage.getItem(loginKey) || "null") as {
		verifier: string
		state: string
		redirectUri: string
	} | null
	sessionStorage.removeItem(loginKey)
	if (!pending || params.get("state") !== pending.state) {
		throw new Error("Spotify sign-in could not be verified. Please try again.")
	}
	if (params.has("error")) {
		throw new Error("Spotify sign-in was cancelled. Please try again.")
	}
	const code = params.get("code")
	if (!code) throw new Error("Spotify did not return a sign-in code. Please try again.")
	return requestToken({
		grant_type: "authorization_code",
		code,
		redirect_uri: pending.redirectUri,
		code_verifier: pending.verifier,
	})
}

let refreshRequest: Promise<string> | null = null

export const getAccessToken = async (forceRefresh = false): Promise<string> => {
	const session = readSession()
	if (!session) throw new Error("Please sign in to Spotify.")
	if (!forceRefresh && session.expiresAt > Date.now() + 30_000) return session.accessToken
	if (!refreshRequest) {
		refreshRequest = requestToken(
			{ grant_type: "refresh_token", refresh_token: session.refreshToken },
			session.refreshToken,
		).finally(() => {
			refreshRequest = null
		})
	}
	return refreshRequest
}
