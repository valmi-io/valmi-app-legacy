import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { auth } from "./auth";
import { user } from "./user";

const rootReducer = combineReducers({
	[auth.name]: auth.reducer,
	[user.name]: user.reducer,
	[apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
