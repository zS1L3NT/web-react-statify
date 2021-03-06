import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Box, Card, CardActionArea, CardMedia, Skeleton, Typography } from "@mui/material"

import useAppDispatch from "../../hooks/useAppDispatch"
import useSpotifyApi from "../../hooks/useSpotifyApi"
import { set_error } from "../../slices/ErrorSlice"
import AsyncImage from "../AsyncImage"

interface Props {
	album?: SpotifyApi.AlbumObjectSimplified
	position?: number
}

const AlbumCard: React.FC<Props> = (props: Props) => {
	const { position, album } = props

	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const api = useSpotifyApi()
	const [data, setData] = useState<SpotifyApi.AlbumObjectFull>()

	useEffect(() => {
		if (!api) return
		if (!album) return

		api.getAlbum(album.id)
			.then(setData)
			.catch(err => dispatch(set_error(err)))
	}, [dispatch, api, album])

	const handleAlbumClick = () => {
		if (album) {
			navigate("/album/" + album.id)
		}
	}

	return (
		<Card onClick={handleAlbumClick}>
			<CardActionArea>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row"
					}}>
					<AsyncImage
						src={data?.images[0]?.url}
						skeleton={<Skeleton variant="rectangular" width={120} height={120} />}
						component={thumbnailUrl => (
							<CardMedia
								component="img"
								sx={{ width: 120 }}
								image={thumbnailUrl}
								alt="Picture"
							/>
						)}
					/>
					<CardMedia
						sx={{
							ml: 2,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center"
						}}>
						{data ? (
							<>
								<Typography variant="h5">{data.name}</Typography>
								<Typography variant="subtitle1">Track #{position}</Typography>
							</>
						) : (
							<>
								<Skeleton variant="text" width={200} height={40} />
								<Skeleton variant="text" width={160} height={30} />
							</>
						)}
					</CardMedia>
				</Box>
			</CardActionArea>
		</Card>
	)
}

export default AlbumCard
