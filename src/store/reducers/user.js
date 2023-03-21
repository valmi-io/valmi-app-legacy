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
