import LazyLoad from "react-lazyload"
import { useNavigate } from "react-router-dom"

import {
	Avatar,
	Card,
	CardActionArea,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Skeleton,
	Stack,
} from "@mui/material"

import AsyncImage from "./AsyncImage"

const Track = ({
	track,
	album,
	i,
}: {
	track?: SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified
	album?: SpotifyApi.AlbumObjectSimplified
	i: number
}) => {
	const navigate = useNavigate()

	const handleTrackClick = (track?: SpotifyApi.TrackObjectSimplified) => {
		if (track) {
			navigate("/track/" + track.id)
		}
	}

	return (
		<LazyLoad height={72}>
			<Card
				sx={{ my: 1 }}
				key={i}
				onClick={() => handleTrackClick(track)}>
				<CardActionArea>
					<ListItem>
						<ListItemAvatar>
							<AsyncImage
								src={
									(track && "album" in track ? track.album : album)?.images[0]
										?.url
								}
								skeleton={
									<Skeleton
										variant="circular"
										width={45}
										height={45}
									/>
								}
								component={thumbnailUrl => (
									<Avatar
										sx={{ width: 45, height: 45 }}
										src={thumbnailUrl}
									/>
								)}
							/>
						</ListItemAvatar>
						{track ? (
							<ListItemText
								primary={track.name}
								secondary={track.artists.map(a => a.name).join(", ")}
							/>
						) : (
							<Stack my="6px">
								<Skeleton
									variant="text"
									width={200}
									height={24}
								/>
								<Skeleton
									variant="text"
									width={160}
									height={20}
								/>
							</Stack>
						)}
					</ListItem>
				</CardActionArea>
			</Card>
		</LazyLoad>
	)
}

export default Track
