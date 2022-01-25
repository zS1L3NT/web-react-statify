import getTimeSincePlayed from "../../utils/getTimeSincePlayed"
import React from "react"
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
	Typography
} from "@mui/material"
import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"

interface Props {
	smallScreen: boolean
	images?: string[]
	recent?: SpotifyApi.PlayHistoryObject
	i?: number
}

const RecentItem: React.FC<Props> = (props: Props) => {
	const { smallScreen, images, recent, i } = props

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
		<ListItem onClick={() => handleTrackClick(recent?.track)} disablePadding>
			<ListItemButton>
				<ListItemAvatar>
					{images && i ? (
						<Avatar sx={{ width: 45, height: 45 }} src={images[i] || ""} />
					) : (
						<Skeleton variant="circular" width={45} height={45} />
					)}
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
						<Skeleton variant="text" width={200} height={24} />
						<Skeleton variant="text" width={160} height={20} />
					</Stack>
				)}
			</ListItemButton>
		</ListItem>
	) : (
		<TableRow hover>
			<TableCell>
				{images && i ? (
					<Avatar sx={{ width: 45, height: 45 }} src={images[i] || ""} />
				) : (
					<Skeleton variant="circular" width={45} height={45} />
				)}
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
					<Skeleton variant="text" width={160} height={20} />
				)}
			</TableCell>
			<TableCell>
				{recent ? (
					<Typography variant="body1">
						{recent.track.artists
							.map(artist => (
								<Link
									sx={{
										cursor: "pointer"
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
					<Skeleton variant="text" width={120} height={20} />
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
					<Skeleton variant="text" width={160} height={20} />
				)}
			</TableCell>
		</TableRow>
	)
}

export default RecentItem
