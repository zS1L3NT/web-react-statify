import { DateTime } from "luxon"
import LazyLoad from "react-lazyload"
import { useNavigate } from "react-router-dom"

import {
	Avatar,
	Link,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Skeleton,
	Stack,
	TableCell,
	TableRow,
	Typography,
} from "@mui/material"

import getTimeSincePlayed from "../../utils/getTimeSincePlayed"
import AsyncImage from "../AsyncImage"

const RecentItem = ({
	smallScreen,
	recent,
}: {
	smallScreen: boolean
	recent?: SpotifyApi.PlayHistoryObject
}) => {
	const navigate = useNavigate()

	const handleTrackClick = (track?: SpotifyApi.TrackObjectSimplified) => {
		if (track) {
			navigate("/track/" + track.id)
		}
	}

	const handleArtistClick = (artist: SpotifyApi.ArtistObjectSimplified) => {
		navigate("/artist/" + artist.id)
	}

	return smallScreen ? (
		<LazyLoad height={72}>
			<ListItem
				onClick={() => handleTrackClick(recent?.track)}
				disablePadding>
				<ListItemButton>
					<ListItemAvatar>
						<AsyncImage
							// @ts-ignore
							src={recent.track.album.images[0].url}
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
					{recent ? (
						<ListItemText
							primary={
								recent.track.name +
								" - " +
								recent.track.artists.map(a => a.name).join(", ")
							}
							secondary={
								getTimeSincePlayed(recent) +
								" ago, " +
								DateTime.fromISO(recent.played_at).toFormat("d LLLL yyyy")
							}
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
				</ListItemButton>
			</ListItem>
		</LazyLoad>
	) : (
		<TableRow hover>
			<TableCell>
				<AsyncImage
					// @ts-ignore
					src={recent.track.album.images[0].url}
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
			</TableCell>
			<TableCell>
				{recent ? (
					<Typography variant="body1">
						<Link
							sx={{ cursor: "pointer" }}
							color="inherit"
							onClick={() => handleTrackClick(recent.track)}
							underline="hover">
							{recent.track.name}
						</Link>
					</Typography>
				) : (
					<Skeleton
						variant="text"
						width={160}
						height={20}
					/>
				)}
			</TableCell>
			<TableCell>
				{recent ? (
					<Typography variant="body1">
						{recent.track.artists
							.map(artist => (
								<Link
									sx={{
										cursor: "pointer",
									}}
									key={artist.id}
									color="inherit"
									onClick={() => handleArtistClick(artist)}
									underline="hover">
									{artist.name}
								</Link>
							))
							.reduce<(JSX.Element | string)[]>((r, a) => r.concat(a, ", "), [])
							.slice(0, -1)}
					</Typography>
				) : (
					<Skeleton
						variant="text"
						width={120}
						height={20}
					/>
				)}
			</TableCell>
			<TableCell align="center">
				{recent ? (
					<Typography variant="body1">
						{getTimeSincePlayed(recent) +
							" ago, " +
							DateTime.fromISO(recent.played_at).toFormat("d LLLL yyyy")}
					</Typography>
				) : (
					<Skeleton
						variant="text"
						width={160}
						height={20}
					/>
				)}
			</TableCell>
		</TableRow>
	)
}

export default RecentItem
