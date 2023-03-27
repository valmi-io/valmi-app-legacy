/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
	user: null,
	workspaceId: "",
};

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserData(state, action) {
			state.user = action.payload;
		},
		setWorkspaceId(state, action) {
			state.workspaceId = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			return {
				...state,
				...action.payload.user,
			};
		});
	},
});

export const { setUserData, setWorkspaceId } = user.actions;

export default user.reducer;
