import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useIsOnline } from "react-use-is-online"

import CloudOffIcon from "@mui/icons-material/CloudOff"
import { Box, Button, LinearProgress, Typography } from "@mui/material"

import useAppDispatch from "../hooks/useAppDispatch"
import useAppSelector from "../hooks/useAppSelector"
import { setToken } from "../slices/TokenSlice"
import { completeAuthorization, createAuthorizationUrl } from "../utils/spotifyAuth"

const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const token = useAppSelector(state => state.token)
	const dispatch = useAppDispatch()

	const { isOnline, isOffline } = useIsOnline()
	const [error, setError] = useState("")

	useEffect(() => {
		if (isOffline) return
		// Keep the verifier and callback on the same origin during local development.
		if (window.location.hostname === "localhost") {
			window.location.replace(window.location.href.replace("localhost", "127.0.0.1"))
			return
		}
		let cancelled = false
		const login = async () => {
			const params = new URLSearchParams(location.search)
			if (params.has("code") || params.has("error")) {
				const accessToken = await completeAuthorization(location.search)
				if (cancelled) return
				dispatch(setToken(accessToken))
			} else if (!token) {
				const url = await createAuthorizationUrl()
				if (!cancelled) window.location.href = url
				return
			}
			const redirect = sessionStorage.getItem("redirect") || "/"
			sessionStorage.removeItem("redirect")
			navigate(redirect, { replace: true })
		}
		login().catch(err => {
			if (!cancelled) setError((err as Error).message)
		})
		return () => {
			cancelled = true
		}
	}, [dispatch, location.search, token, isOffline, navigate])

	if (error)
		return (
			<Box sx={{ mt: 8, textAlign: "center" }}>
				<Typography role="alert">{error}</Typography>
				<Button href="/login">Try again</Button>
			</Box>
		)

	return isOnline ? (
		<LinearProgress />
	) : (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}>
			<CloudOffIcon sx={{ mt: 16, height: 96, width: 96 }} />
			<Typography
				sx={{ mt: 4 }}
				variant="h5">
				You&apos;re Offline!
			</Typography>
			<Typography sx={{ mt: 1, textAlign: "center" }}>
				Waiting for Internet Connection
				<br />
				before proceeding...
			</Typography>
		</Box>
	)
}

export default Login
