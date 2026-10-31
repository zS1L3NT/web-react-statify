import SpotifyWebApi from "spotify-web-api-js"

import { BaseQueryFn } from "@reduxjs/toolkit/query/react"

import { setError } from "../slices/ErrorSlice"
import { setToken } from "../slices/TokenSlice"
import { getAccessToken, getStoredAccessToken } from "./spotifyAuth"

export default (async ([func, args, token], { dispatch }) => {
	const spotifyApi = new SpotifyWebApi()

	try {
		const accessToken = await getAccessToken()
		spotifyApi.setAccessToken(accessToken)
		if (accessToken !== token) dispatch(setToken(accessToken))
		try {
			// @ts-ignore
			return { data: await spotifyApi[func](...args) }
		} catch (err) {
			if ((err as { status?: number }).status !== 401) throw err
			const refreshedToken = await getAccessToken(true)
			spotifyApi.setAccessToken(refreshedToken)
			dispatch(setToken(refreshedToken))
			// @ts-ignore
			return { data: await spotifyApi[func](...args) }
		}
	} catch (err) {
		if (!getStoredAccessToken()) dispatch(setToken(null))
		dispatch(setError(err as Error))
		return { error: err as Error }
	}
}) satisfies BaseQueryFn<
	[func: keyof SpotifyWebApi.SpotifyWebApiJs, args: any[], token: string],
	unknown,
	object
>
