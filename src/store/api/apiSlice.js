import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import CONSTANTS from "src/constants/urls";
import AuthStorage from "src/utils/auth-storage";

const { API_URL, SPACES_URL, LOGIN_URL, LOGOUT_URL } = CONSTANTS;

const staggeredBaseQueryWithBailOut = retry(
	async (args, api, extraOptions) => {
		const result = await fetchBaseQuery({
			baseUrl: API_URL,
			timeout: 10000, // 10 seconds
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
		if (result.error?.status === 401) {
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
		// The `getSpaces` endpoint is a "query" operation that returns data
		fetchWorkSpaces: builder.query({
			// The URL for the request is '/api/v1/spaces'
			query: () => ({
				url: SPACES_URL,
			}),
		}),
		signupUser: builder.query({
			// The URL for the request is '/api/v1/users/'
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
			// The URL for the request is '/api/v1/users/activation/'
			query: (arg) => {
				console.log("arg:_", arg);
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
					url: LOGIN_URL,
					method: "POST",
					body: arg,
				});
				if (user.error) return { error: user.error };
				const token = user.data.auth_token;
				AuthStorage.value = {
					token: token,
				};
				const result = await baseQuery(SPACES_URL);
				return result.data
					? { data: result.data }
					: { error: result.error };
			},
		}),
		logoutUser: builder.query({
			// The URL for the request is '/api/v1//token/logout'
			query: () => {
				return {
					url: LOGOUT_URL,
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
			// The URL for the request is '/api/v1/connectors'
			query: () => {
				return {
					url: `/connectors/`,
				};
			},
		}),
		checkAndAddConnectorSpec: builder.query({
			async queryFn(arg, queryApi, extraOptions, baseQuery) {
				console.log("=============================");
				console.log("Check and add connector spec is called:-", arg);
				const { type, workspaceId, config, name } = arg;
				const spec = await baseQuery({
					url: `/workspaces/${workspaceId}/connectors/${type}/check`,
					method: "POST",
					body: config,
				});
				console.log("checkAndAddConnectorSpec response:-", spec);
				if (spec.error) return { error: spec.error };
				if (spec.data) {
					console.log("Spec data:-", spec.data);
					const {
						connectionStatus: { status, message },
					} = spec.data;
					if (status === "FAILED") return { error: message };
				}
				console.log("====================================");
				console.log(
					"Add Credentials to this work space id:_",
					workspaceId
				);
				const payload = {
					connector_type: type,
					connector_config: config.config,
					// name: type.split("_")[1],
					name,
				};
				console.log("payload_", payload);
				const result = await baseQuery({
					url: `/workspaces/${workspaceId}/credentials/create`,
					method: "POST",
					body: payload,
				});
				console.log("result of adding credentials:-", result);
				return result.data
					? { data: result.data }
					: { error: result.error };
			},
		}),
		discoverConnector: builder.query({
			// The URL for the request is '/api/v1/connectors'
			query: (arg) => {
				const { config, workspaceId, connectorType } = arg;
				console.log("Arg:_", arg);
				console.log("=========================");
				console.log("discover connector:_ config", config);
				console.log("discover connector:- workspaceID", workspaceId);
				console.log(
					"discover connector:_ connectortype:_",
					connectorType
				);
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
			// The URL for the request is '/api/v1/connectors'
			query: (arg) => {
				const { workspaceId } = arg;
				return {
					url: `/workspaces/${workspaceId}/credentials/`,
				};
			},
		}),
		addCredentials: builder.query({
			async queryFn(arg, queryApi, extraOptions, baseQuery) {
				console.log("=============================");
				console.log("add credentials-", arg);
				const { src, dest, schedule, syncName, workspaceId } = arg;
				console.log("Src:_", src);

				const sourceRes = await baseQuery({
					url: `/workspaces/${workspaceId}/sources/create`,
					method: "POST",
					body: src,
				});
				console.log("source Res", sourceRes);
				if (sourceRes.error) return { error: sourceRes.error };
				console.log("--------------------------");
				console.log("Source created:_", sourceRes.data);
				const { id: sourceId } = sourceRes.data;
				const destRes = await baseQuery({
					url: `/workspaces/${workspaceId}/destinations/create`,
					method: "POST",
					body: dest,
				});
				console.log("Dest res:_", destRes);
				if (destRes.error) return { error: destRes.error };
				console.log("Destination created:_", destRes.data);
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
			// The URL for the request is '/api/v1/connectors'
			query: (arg) => {
				const { workspaceId } = arg;
				return {
					url: `/workspaces/${workspaceId}/syncs/`,
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
} = apiSlice;
