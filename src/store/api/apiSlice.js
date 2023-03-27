/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import CONSTANTS from "src/constants/urls";
import AuthStorage from "src/utils/auth-storage";

const { API_URL } = CONSTANTS;

const staggeredBaseQueryWithBailOut = retry(
	async (args, api, extraOptions) => {
		const result = await fetchBaseQuery({
			baseUrl: API_URL,
			//timeout: 10000, // 10 seconds,
			signal: new AbortController().signal,
			prepareHeaders: async (headers, { getState }) => {
				//console.log("auth storage.token:_", AuthStorage.token);
				const token = (await AuthStorage.token) || "";
				//console.log("apiSlice:_ prepareHeaders token:_", token);

				// If we have a token set in state, let's assume that we should be passing it.
				if (token) {
					headers.set("authorization", `Bearer ${token}`);
				}

				return headers;
			},
		})(args, api, extraOptions);

		// bail out of re-tries immediately if unauthorized,
		// because we know successive re-retries would be redundant
		// console.log("===================================");
		// console.log("result:-------------------------", result);
		if (
			result.error?.status === 401
			//||
			// result.error?.status === "FETCH_FAILED" ||
			// result.error?.status === "FETCH_ERROR"
		) {
			retry.fail(result.error);
		}

		return result;
	},
	{
		maxRetries: 3,
	}
);
// Define our single API slice object
export const apiSlice = createApi({
	// The cache reducer expects to be added at `state.api` (already default - this is optional)
	reducerPath: "api",
	// All of our requests will have URLs starting with '/api/v1'
	baseQuery: staggeredBaseQueryWithBailOut,
	// The "endpoints" represent operations and requests for this server

	endpoints: (builder) => ({
		fetchWorkSpaces: builder.query({
			query: () => ({
				url: `/spaces/`,
			}),
		}),
		signupUser: builder.query({
			query: (arg) => {
				console.log("arg:_", arg);
				return {
					url: "/users/",
					method: "POST",
					body: arg,
				};
			},
		}),
		activateUser: builder.query({
			query: (arg) => {
				return {
					url: "/users/activation/",
					method: "POST",
					body: arg,
				};
			},
		}),
		loginAndFetchWorkSpaces: builder.query({
			async queryFn(arg, queryApi, extraOptions, baseQuery) {
				const user = await baseQuery({
					url: `/token/login`,
					method: "POST",
					body: arg,
				});
				if (user.error) return { error: user.error };
				const token = user.data.auth_token;
				AuthStorage.value = {
					token: token,
				};
				const result = await baseQuery(`/spaces/`);
				return result.data
					? { data: result.data }
					: { error: result.error };
			},
		}),
		logoutUser: builder.query({
			query: () => {
				return {
					url: `/token/logout`,
					method: "POST",
					body: {},
				};
			},
		}),
		fetchConnectorSpec: builder.query({
			query: (arg) => {
				const { type, workspaceId } = arg;
				return {
					url: `/workspaces/${workspaceId}/connectors/${type}/spec`,
				};
			},
		}),
		fetchConnectors: builder.query({
			query: () => {
				return {
					url: `/connectors/`,
				};
			},
		}),
		checkAndAddConnectorSpec: builder.query({
			async queryFn(arg, queryApi, extraOptions, baseQuery) {
				const { type, workspaceId, config, name } = arg;
				const spec = await baseQuery({
					url: `/workspaces/${workspaceId}/connectors/${type}/check`,
					method: "POST",
					body: config,
				});
				if (spec.error) return { error: spec.error };
				if (spec.data) {
					const {
						connectionStatus: { status, message },
					} = spec.data;
					if (status === "FAILED") return { error: message };
				}
				const payload = {
					connector_type: type,
					connector_config: config.config,
					name,
				};
				const result = await baseQuery({
					url: `/workspaces/${workspaceId}/credentials/create`,
					method: "POST",
					body: payload,
				});
				return result.data
					? { data: result.data }
					: { error: result.error };
			},
		}),
		discoverConnector: builder.query({
			query: (arg) => {
				const { config, workspaceId, connectorType } = arg;
				return {
					url: `/workspaces/${workspaceId}/connectors/${connectorType}/discover`,
					method: "POST",
					body: {
						config,
					},
				};
			},
		}),
		fetchCredentials: builder.query({
			query: (arg) => {
				const { workspaceId } = arg;
				return {
					url: `/workspaces/${workspaceId}/credentials/`,
				};
			},
		}),
		addCredentials: builder.query({
			async queryFn(arg, queryApi, extraOptions, baseQuery) {
				const { src, dest, schedule, syncName, workspaceId } = arg;

				const sourceRes = await baseQuery({
					url: `/workspaces/${workspaceId}/sources/create`,
					method: "POST",
					body: src,
				});
				if (sourceRes.error) return { error: sourceRes.error };
				const { id: sourceId } = sourceRes.data;
				const destRes = await baseQuery({
					url: `/workspaces/${workspaceId}/destinations/create`,
					method: "POST",
					body: dest,
				});
				if (destRes.error) return { error: destRes.error };
				const { id: destinationId } = destRes.data;
				const syncPayload = {
					name: syncName,
					source_id: sourceId,
					destination_id: destinationId,
					schedule,
				};
				const createSync = await baseQuery({
					url: `/workspaces/${workspaceId}/syncs/create`,
					method: "POST",
					body: syncPayload,
				});
				return createSync.data
					? { data: createSync.data }
					: { error: createSync.error };
			},
		}),
		fetchSyncs: builder.query({
			query: (arg) => {
				const { workspaceId } = arg;
				return {
					url: `/workspaces/${workspaceId}/syncs/`,
				};
			},
		}),
		getSyncById: builder.query({
			query: (arg) => {
				const { workspaceId, syncId } = arg;
				return {
					url: `/workspaces/${workspaceId}/syncs/${syncId}`,
				};
			},
		}),
		getSyncRunsById: builder.query({
			query: (arg) => {
				console.log("===============================");
				console.log("get sync runs by id is called:_");
				const { workspaceId, syncId, before, limit } = arg;
				const date = before.replace(/"/g, "");
				console.log("Arg:_", arg);
				return {
					url: `/workspaces/${workspaceId}/syncs/${syncId}/runs/?before=${date}&limit=${limit}`,
				};
			},
		}),
		toggleSync: builder.query({
			query: (arg) => {
				const { workspaceId, enable, config } = arg;
				let url = `/workspaces/${workspaceId}/syncs/disable`;
				if (enable) {
					url = `/workspaces/${workspaceId}/syncs/enable`;
				}

				return {
					url,
					method: "POST",
					body: config,
				};
			},
		}),
	}),
});

// Export the auto-generated hook for the `getSpaces` query endpoint
export const {
	useLazyFetchWorkSpacesQuery,
	useLazyLoginAndFetchWorkSpacesQuery,
	useLazyFetchConnectorSpecQuery,
	useFetchConnectorsQuery,
	useLazySignupUserQuery,
	useLazyActivateUserQuery,
	useLazyLogoutUserQuery,
	useLazyCheckAndAddConnectorSpecQuery,
	useLazyDiscoverConnectorQuery,
	useFetchCredentialsQuery,
	useLazyAddCredentialsQuery,
	useFetchSyncsQuery,
	useLazyToggleSyncQuery,
	useLazyGetSyncByIdQuery,
	useLazyGetSyncRunsByIdQuery,
} = apiSlice;
