import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import useAppDispatch from "../hooks/useAppDispatch"
import { setToken } from "../slices/TokenSlice"
import { clearSpotifySession } from "../utils/spotifyAuth"

const Logout = () => {
	const navigate = useNavigate()

	const dispatch = useAppDispatch()

	useEffect(() => {
		clearSpotifySession()
		dispatch(setToken(null))
		navigate("/")
		sessionStorage.removeItem("redirect")
	}, [dispatch, navigate])

	return <></>
}

export default Logout
