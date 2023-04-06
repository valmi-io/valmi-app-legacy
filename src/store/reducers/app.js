/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
	selectedConnector: {},
	spec: {},
	query: {},
};

export const app = createSlice({
	name: "app",
	initialState,
	reducers: {
		setSelectedConnector(state, action) {
			state.selectedConnector = action.payload;
		},
		setSpec(state, action) {
			state.spec = action.payload;
		},
		setQuery(state, action) {
			state.query = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			return {
				...state,
				...action.payload.app,
			};
		});
	},
});

export const { setSelectedConnector, setSpec, setQuery } = app.actions;

export default app.reducer;
