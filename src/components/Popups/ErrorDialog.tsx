import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
	Backdrop,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material"

import useAppDispatch from "../../hooks/useAppDispatch"
import useAppSelector from "../../hooks/useAppSelector"
import { setError } from "../../slices/ErrorSlice"
import { setToken } from "../../slices/TokenSlice"
import { clearSpotifySession } from "../../utils/spotifyAuth"

const ErrorDialog = () => {
	const navigate = useNavigate()

	const error = useAppSelector(state => state.error)
	const dispatch = useAppDispatch()

	const [localError, setLocalError] = useState<Error>()

	useEffect(() => {
		if (error) setLocalError(error)
	}, [error])

	const handleRetry = () => {
		dispatch(setError(null))

		// If is a id not found error, don't set the redirect path and don't logout
		if (localError?.message.endsWith(" not found")) {
			setTimeout(() => navigate("/"), 500)
		} else {
			clearSpotifySession()
			dispatch(setToken(null))
			if (location.pathname !== "/login") {
				sessionStorage.setItem("redirect", location.pathname)
			}
			setTimeout(() => navigate("/login"), 500)
		}
	}

	const handleHome = () => {
		dispatch(setError(null))
		navigate("/")
	}

	return (
		<Dialog
			open={!!error}
			BackdropComponent={Backdrop}
			fullWidth>
			<DialogTitle>{localError?.name || ""}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{localError?.message || ""}
					<br />
					{localError?.message.endsWith(" not found")
						? "You will be redirected home"
						: "You will be signed out"}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{localError?.message.endsWith(" not found") ? null : (
					<Button onClick={handleHome}>Home</Button>
				)}
				<Button onClick={handleRetry}>Retry</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ErrorDialog
