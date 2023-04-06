export function generate_config_from_spec(spec, values) {
	return create_json_object(
		spec.spec.connectionSpecification.required,
		spec.spec.connectionSpecification.properties,
		values
	);
}

function create_json_object(required, properties_def, values) {
	let obj = {};
	for (const field of required) {
		if (properties_def[field].type == "object") {
			obj[field] = create_json_object(
				properties_def[field].required,
				properties_def[field].properties,
				values
			);
		} else {
			obj[field] = values[field];
		}
	}
	return obj;
}

/*
console.log(
	generate_config_oauth(
		{
			type: "SPEC",
			spec: {
				documentationUrl:
					"https://docs.airbyte.com/integrations/destinations/google-sheets",
				connectionSpecification: {
					$schema: "http://json-schema.org/draft-07/schema#",
					title: "Destination Google Sheets",
					type: "object",
					required: ["credentials"],
					additionalProperties: false,
					properties: {
						credentials: {
							type: "object",
							title: "Authentication via Google (OAuth)",
							description:
								"Google API Credentials for connecting to Google Sheets and Google Drive APIs",
							required: [
								"client_id",
								"client_secret",
								"refresh_token",
							],
							properties: {
								client_id: {
									title: "Client ID",
									type: "string",
									description:
										"The Client ID of your Google Sheets developer application.",
									airbyte_secret: true,
								},
								client_secret: {
									title: "Client Secret",
									type: "string",
									description:
										"The Client Secret of your Google Sheets developer application.",
									airbyte_secret: true,
								},
								refresh_token: {
									title: "Refresh Token",
									type: "string",
									description:
										"The token for obtaining new access token.",
									airbyte_secret: true,
								},
							},
						},
					},
				},
				supportsIncremental: true,
				supported_destination_sync_modes: [
					"overwrite",
					"append",
					"append_dedup",
				],
				authSpecification: {
					auth_type: "oauth2.0",
					oauth2Specification: {
						rootObject: ["credentials"],
						oauthFlowInitParameters: [
							["client_id"],
							["client_secret"],
						],
						oauthFlowOutputParameters: [["refresh_token"]],
					},
				},
			},
		},
		{ client_id: "zz", client_secret: "xx", refresh_token: "rt" }
	)
);*/
