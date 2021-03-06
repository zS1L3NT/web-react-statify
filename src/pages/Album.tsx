import { useTry as _useTry, useTryAsync as _useTryAsync } from "no-try"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import { Container, Grid, List, Typography } from "@mui/material"

import ArtistCard from "../components/Cards/ArtistCard"
import AlbumDetails from "../components/Details/AlbumDetails"
import Track from "../components/Track"
import useAppDispatch from "../hooks/useAppDispatch"
import useAuthenticated from "../hooks/useAthenticated"
import useSpotifyApi from "../hooks/useSpotifyApi"
import { set_error } from "../slices/ErrorSlice"

/**
 * * Name
 * ! Release Date
 * * Length
 * * Artists
 * * - Name
 * * - Link
 * * - Picture
 * * Tracks
 * * - Name
 * * - Artists
 * * - Picture
 */

const Album: React.FC = () => {
	const dispatch = useAppDispatch()
	const location = useLocation()
	const api = useSpotifyApi()
	const [album, setAlbum] = useState<SpotifyApi.SingleAlbumResponse>()
	const [tracks, setTracks] = useState<(SpotifyApi.TrackObjectSimplified | undefined)[]>(
		Array(10).fill(undefined)
	)

	useAuthenticated()

	useEffect(() => {
		if (!api) return

		const [, , albumId] = location.pathname.split("/")
		if (albumId) {
			api.getAlbum(albumId)
				.then(setAlbum)
				.catch(err => {
					const [, message] = _useTry(() => JSON.parse(err.response).error.message)
					dispatch(
						set_error(message === "invalid id" ? new Error("Album not found") : err)
					)
				})
		} else {
			dispatch(set_error(new Error("Album not found")))
		}
	}, [dispatch, location.pathname, api])

	useEffect(() => {
		if (!api) return
		if (!album) return

		_useTryAsync(async () => {
			const tracks: SpotifyApi.TrackObjectSimplified[] = []
			const total = (await api.getAlbumTracks(album.id)).total

			while (tracks.length < total) {
				tracks.push(
					...(await api.getAlbumTracks(album.id, { limit: 50, offset: tracks.length }))
						.items
				)
			}

			return tracks
		}).then(([err, tracks]) => {
			if (err) {
				dispatch(set_error(err))
			} else {
				setTracks(tracks)
			}
		})
	}, [dispatch, api, album])

	return (
		<Container>
			<AlbumDetails album={album} tracks={tracks} />

			<Typography sx={{ mt: { sm: 1 }, mb: 2 }} variant="h5">
				Artists
			</Typography>
			<Grid direction={{ xs: "column", sm: "row" }} container>
				{album ? (
					album.artists.map(artist => (
						<Grid sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }} key={artist.id} item>
							<ArtistCard artist={artist} />
						</Grid>
					))
				) : (
					<Grid sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }} item>
						<ArtistCard />
					</Grid>
				)}
			</Grid>

			<Typography sx={{ mt: { sm: 1 }, mb: 2 }} variant="h5">
				Tracks
			</Typography>
			<List>
				{tracks.map((track, i) => (
					<Track key={i} track={track} album={album} i={i} />
				))}
			</List>
		</Container>
	)
}

export default Album
