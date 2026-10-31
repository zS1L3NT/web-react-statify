import { useEffect } from "react"
import ReactGA from "react-ga4"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { CssBaseline, ThemeProvider } from "@mui/material"

import Navigator from "./components/Navigation/Navigator"
import ErrorDialog from "./components/Popups/ErrorDialog"
import InfoSnackbar from "./components/Popups/InfoSnackbar"
import PWASnackbar from "./components/Popups/PWASnackbar"
import useThemeValue from "./hooks/useThemeValue"
import Album from "./pages/Album"
import Artist from "./pages/Artist"
import Dark from "./pages/Dark"
import Home from "./pages/Home"
import Light from "./pages/Light"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import RecentlyPlayed from "./pages/RecentlyPlayed"
import TopArtists from "./pages/TopArtists"
import TopTracks from "./pages/TopTracks"
import Track from "./pages/Track"
import { dark, light } from "./theme"

const App = (): JSX.Element => {
	const location = useLocation()

	useEffect(() => {
		ReactGA.initialize("G-P3JDSNFPZ5")

		setTimeout(() => {
			const preload = document.getElementsByClassName("preload").item(0)!
			preload.classList.add("preload-hide")
			setTimeout(() => preload.remove(), 1000)
		}, 1000)
	}, [])

	useEffect(() => {
		window.scrollTo({ top: 0 })
		ReactGA.send({ hitType: "pageview", page: location.pathname })
	}, [location])

	return (
		<ThemeProvider theme={useThemeValue(dark, light)}>
			<CssBaseline />
			<Navigator />
			<Routes>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="login"
					element={<Login />}
				/>
				<Route
					path="logout"
					element={<Logout />}
				/>
				<Route path="top-tracks">
					<Route
						index
						element={
							<Navigate
								to="short-term"
								replace
							/>
						}
					/>
					<Route
						path="short-term"
						element={<TopTracks />}
					/>
					<Route
						path="medium-term"
						element={<TopTracks />}
					/>
					<Route
						path="long-term"
						element={<TopTracks />}
					/>
					<Route
						path="*"
						element={
							<Navigate
								to="short-term"
								replace
							/>
						}
					/>
				</Route>
				<Route path="top-artists">
					<Route
						index
						element={
							<Navigate
								to="short-term"
								replace
							/>
						}
					/>
					<Route
						path="short-term"
						element={<TopArtists />}
					/>
					<Route
						path="medium-term"
						element={<TopArtists />}
					/>
					<Route
						path="long-term"
						element={<TopArtists />}
					/>
					<Route
						path="*"
						element={
							<Navigate
								to="short-term"
								replace
							/>
						}
					/>
				</Route>
				<Route
					path="recents"
					element={<RecentlyPlayed />}
				/>
				<Route
					path="dark"
					element={<Dark />}
				/>
				<Route
					path="light"
					element={<Light />}
				/>
				<Route path="track">
					<Route
						index
						element={
							<Navigate
								to=""
								replace
							/>
						}
					/>
					<Route
						path=":id"
						element={<Track />}
					/>
				</Route>
				<Route path="artist">
					<Route
						index
						element={
							<Navigate
								to=""
								replace
							/>
						}
					/>
					<Route
						path=":id"
						element={<Artist />}
					/>
				</Route>
				<Route path="album">
					<Route
						index
						element={
							<Navigate
								to=""
								replace
							/>
						}
					/>
					<Route
						path=":id"
						element={<Album />}
					/>
				</Route>
				<Route
					path="*"
					element={
						<Navigate
							to=""
							replace
						/>
					}
				/>
			</Routes>
			<ErrorDialog />
			<PWASnackbar />
			<InfoSnackbar />
		</ThemeProvider>
	)
}

export const tabs = [
	{
		term: "short_term",
		description: "Last Month",
	},
	{
		term: "medium_term",
		description: "Last 6 Months",
	},
	{
		term: "long_term",
		description: "All Time",
	},
] as const

export default App
