import AlbumDetails from "../components/Details/AlbumDetails"
import ArtistCard from "../components/Cards/ArtistCard"
import React, { useEffect, useState } from "react"
import Track from "../components/Track"
import useAuthenticated from "../hooks/useAthenticated"
import useSpotifyApi from "../hooks/useSpotifyApi"
import { Container, Grid, List, Typography } from "@mui/material"
import { set_error } from "../actions/ErrorActions"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { useTryAsync as _useTryAsync } from "no-try"

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
	//#region Hooks
	const dispatch = useDispatch()
	const location = useLocation()
	const api = useSpotifyApi()
	const [album, setAlbum] = useState<SpotifyApi.SingleAlbumResponse | null>()
	const [tracks, setTracks] = useState<(SpotifyApi.TrackObjectSimplified | undefined)[]>(
		Array(10).fill(undefined)
	)
	//#endregion

	//#region Effects
	useAuthenticated()

	useEffect(() => {
		if (!api) return

		const [, , albumId] = location.pathname.split("/")
		if (albumId) {
			api.getAlbum(albumId)
				.then(setAlbum)
				.catch(err => {
					setAlbum(null)
					dispatch(set_error(err))
				})
		} else {
			dispatch(set_error(new Error("Album not found")))
		}
	}, [dispatch, location, api])

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
	//#endregion

	return (
		<Container>
			<AlbumDetails album={album || undefined} tracks={tracks} />

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
					<Track key={i} track={track || undefined} album={album || undefined} i={i} />
				))}
			</List>
		</Container>
	)
}

export default Album
