import {
	configureStore,
	ThunkAction,
	Action,
	AnyAction,
	createAsyncThunk,
} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./api/apiSlice";
import rootReducer from "./reducers";

const makeConfiguredStore = () =>
	configureStore({
		reducer: rootReducer,
		devTools: true,
	});

const reducerProxy = (state: any, action: AnyAction) => {
	if (action.type === "RESET_STORE") {
		return rootReducer(undefined, action);
	}
	return rootReducer(state, action);
};

export const resetStore = createAsyncThunk(
	"auth/logout",
	async function (_payload, thunkAPI) {
		thunkAPI.dispatch({ type: "RESET_STORE" });
	}
);

export const makeStore = () => {
	const isServer = typeof window === "undefined";

	if (isServer) {
		return makeConfiguredStore();
	} else {
		// we need it only on client side

		const persistConfig = {
			key: "app",
			whitelist: ["auth", "user"], // make sure it does not clash with server keys
			storage,
		};

		const persistedReducer = persistReducer(persistConfig, reducerProxy);
		let store: any = configureStore({
			reducer: persistedReducer,
			devTools: process.env.NODE_ENV !== "production",
			middleware: (getDefaultMiddleware) =>
				getDefaultMiddleware({
					serializableCheck: {
						ignoredActions: [
							FLUSH,
							REHYDRATE,
							PAUSE,
							PERSIST,
							PURGE,
							REGISTER,
						],
					},
				}).concat(apiSlice.middleware),
		});

		store.__persistor = persistStore(store);

		return store;
	}
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
