/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { auth } from "./auth";
import { user } from "./user";
import { app } from "./app";

const rootReducer = combineReducers({
	[auth.name]: auth.reducer,
	[user.name]: user.reducer,
	[app.name]: app.reducer,
	[apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
