import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { getStoredAccessToken } from "../utils/spotifyAuth"

type iTokenData = string | null

const slice = createSlice({
	name: "token",
	initialState: getStoredAccessToken() as iTokenData,
	reducers: {
		setToken: (state, action: PayloadAction<iTokenData>) => {
			return action.payload
		},
	},
})

export const { setToken } = slice.actions
export default slice.reducer
