import { message, notification, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CustomButton from "src/components/Button/Button";
import StepCpn from "src/components/Step";
import ConnectionCpn from "src/components/SyncCpn/Connection";
import ConnectionMapping from "src/components/SyncCpn/Mapping";
import ConnectionScheduleCpn from "src/components/SyncCpn/Schedule";
import Title from "src/components/Title";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import {
	useFetchCredentialsQuery,
	useLazyAddCredentialsQuery,
} from "src/store/api/apiSlice";
import { connectorTypes } from "src/utils/lib";

const NewSync = (props) => {
	const router = useRouter();
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	const { data, isLoading, isError, error } = useFetchCredentialsQuery({
		workspaceId,
	});

	const [
		addCredentials,
		{
			data: credentialData,
			isLoading: addCredentialLoading,
			isError: addCredentialsError,
			error: credentialError,
		},
	] = useLazyAddCredentialsQuery();

	const [current, setCurrent] = useState(0);
	const [syncInterval, setSyncInterval] = useState(0);

	const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

	const [syncTitle, setSyncTitle] = useState(
		appConstants.NEW_SYNC_DEFAULT_TITLE
	);

	const [sourceConnectors, setSourceConnectors] = useState(null);
	const [destinationConnectors, setDestinationConnectors] = useState(null);

	const [sourceConnectorMeta, setSourceConnectorMeta] = useState(null);
	const [destinationConnectorMeta, setDestinationConnectorMeta] =
		useState(null);

	const [updatedSourceMeta, setUpdatedSourceMeta] = useState(null);
	const [updatedDestMeta, setUpdatedDestMeta] = useState(null);

	const [destinationFields, setDestinationFields] = useState([]);
	const [mappingModes, setMappingModes] = useState(null);

	useEffect(() => {
		if (data) {
			let sources = [];
			let destinations = [];
			data.forEach((connector) => {
				const connectorType = connector.connector_type.split("_")[0];
				if (connectorType === "SRC") {
					sources.push(connector);
				}
				if (connectorType === "DEST") {
					destinations.push(connector);
				}
			});
			setSourceConnectors(sources);
			setDestinationConnectors(destinations);
		}
	}, [data]);

	useEffect(() => {
		if (credentialData) {
			console.log("=============================");
			console.log("NewSync:_", credentialData);
			message.success("Sync created successfully!");
			router.push(`/spaces/${workspaceId}/syncs`);
		}
	}, [credentialData]);

	useEffect(() => {
		if (addCredentialsError) {
			console.log(
				"New sync:_ Error",
				credentialError.data.detail?.[0].msg
			);

			notification.error({
				message: credentialError.data.detail?.[0].msg,
				description: credentialError.data.detail?.[0].msg,
			});
		}
	}, [addCredentialsError]);

	useEffect(() => {
		if (isError) {
			// notification.error({
			// 	message: errors.SIGN_IN_FAILED,
			// 	description: error.data.non_field_errors[0],
			// });
		}
	}, [isError]);

	useEffect(() => {
		// current === 3 (Schedule step)
		if (current === 3) {
			if (!syncInterval) {
				setIsNextButtonDisabled(true);
			} else {
				setIsNextButtonDisabled(false);
			}
		}
	}, [syncInterval]);

	const next = () => {
		if (current === 2) {
			updateMappingMeta();
		}
		setIsNextButtonDisabled(true);
		setCurrent(current + 1);
	};

	const prev = () => {
		setIsNextButtonDisabled(true);
		setCurrent(current - 1);
	};

	const createSync = () => {
		const payload = {
			src: updatedSourceMeta,
			dest: updatedDestMeta,
			schedule: {
				run_interval: syncInterval * 60 * 1000,
			},
			syncName: syncTitle === "" ? "Sync" : syncTitle,
			workspaceId: workspaceId,
		};
		//console.log("payload:-", payload);
		addCredentials(payload);
	};

	const setConnectorCatalog = (catalog, config) => {
		const {
			id,
			name,
			payload: { connectorType },
		} = config;
		const connector = connectorType.split("_");
		const type = connector[0];
		const connectorName = connector[1];
		const payload = {
			catalog,
			name,
			credential_id: id,
			type: connectorName,
		};
		console.log("payload:-", payload);
		if (type === connectorTypes.SRC) {
			setSourceConnectorMeta(payload);
		} else {
			setDestinationConnectorMeta(payload);
		}
		setIsNextButtonDisabled(false);
	};

	const setMappingMeta = (
		warehouseSyncMode,
		destinationSyncMode,
		primaryKey
	) => {
		if (warehouseSyncMode && destinationSyncMode && primaryKey) {
			setMappingModes({
				warehouseSyncMode,
				destinationSyncMode,
				primaryKey,
			});
			setIsNextButtonDisabled(false);
		}
	};

	const updateMappingMeta = () => {
		const {
			credential_id: sourceId,
			name: sourceName,
			catalog: { json_schema, name, supported_sync_modes },
		} = sourceConnectorMeta;
		let updatedSourceProperties = {};
		let mappingProperties = {};
		for (let i = 0; i < destinationFields.length; i++) {
			const type = { type: destinationFields[i].type };
			updatedSourceProperties[destinationFields[i].name] = type;
			mappingProperties[destinationFields[i].name] =
				destinationFields[i].destField;
		}

		const { destinationSyncMode, warehouseSyncMode, primaryKey } =
			mappingModes;
		const sourcePayload = {
			catalog: {
				streams: [
					{
						sync_mode: warehouseSyncMode,
						destination_sync_mode: destinationSyncMode,
						id_key: primaryKey,
						stream: {
							name,
							supported_sync_modes,
							json_schema: {
								$schema: json_schema.$schema,
								properties: updatedSourceProperties,
							},
						},
					},
				],
			},
			credential_id: sourceId,
			name: sourceName,
		};
		const {
			credential_id: destinationId,
			name: destinationName,
			catalog: destCatalog,
		} = destinationConnectorMeta;

		const destinationPayload = {
			catalog: {
				sinks: [
					{
						mapping: mappingProperties,
						destination_sync_mode: destinationSyncMode,
						sink: destCatalog[0],
					},
				],
			},
			credential_id: destinationId,
			name: destinationName,
		};

		setUpdatedSourceMeta(sourcePayload);
		setUpdatedDestMeta(destinationPayload);
	};

	const displayConnectionCpn = (connectors, connectorType) => {
		return (
			<ConnectionCpn
				connections={connectors}
				workspaceId={workspaceId}
				connectorType={connectorType}
				setConnectorCatalog={setConnectorCatalog}
			/>
		);
	};

	const steps = [
		{
			title: appConstants.SELECT_SRC_CONNECTOR,
			content: displayConnectionCpn(
				sourceConnectors,
				connectorTypes.SOURCE
			),
		},
		{
			title: appConstants.SELECT_DEST_CONNECTOR,
			content: displayConnectionCpn(
				destinationConnectors,
				connectorTypes.DESTINATION
			),
		},
		{
			title: appConstants.SRC_DEST_MAPPING,
			content: (
				<ConnectionMapping
					warehouseMeta={sourceConnectorMeta}
					destinationMeta={destinationConnectorMeta}
					updateConnectorMeta={(updatedMeta) => {
						const { src, dest } = updatedMeta;
						setSourceConnectorMeta(src);
						setDestinationConnectorMeta(dest);
						next();
					}}
					prev={prev}
					setMappingMeta={setMappingMeta}
					destinationFields={destinationFields}
					setDestinationFields={setDestinationFields}
				/>
			),
		},
		{
			title: appConstants.SCHEDULE,
			content: (
				<ConnectionScheduleCpn
					syncInterval={syncInterval}
					setSyncInterval={(val) => {
						setIsNextButtonDisabled(false);
						setSyncInterval(val);
					}}
				/>
			),
		},
	];

	const contentStyle = {
		//lineHeight: "260px",
		textAlign: "center",
		//color: "orange",
		//backgroundColor: "green",
		borderRadius: 10,
		//border: `1px dashed ${"bl"}`,
		marginTop: 16,
	};

	if (isLoading) {
		return <Spin tip="Please wait..." />;
	}

	return (
		<>
			<Title
				title={syncTitle}
				editable={{
					onChange: setSyncTitle,
				}}
				level={4}
			/>
			<StepCpn
				steps={steps}
				current={current}
				contentStyle={contentStyle}
			>
				<div
					style={{
						//backgroundColor: "orange",
						display: "flex",
						justifyContent: "flex-end",
						marginTop: 20,
					}}
				>
					{current < steps.length - 1 && (
						<CustomButton
							title={buttons.NEXT_BUTTON}
							onClick={next}
							size="large"
							disabled={isNextButtonDisabled}
						/>
					)}
					{current === steps.length - 1 && (
						<CustomButton
							title={buttons.CREATE_BUTTON}
							loading={addCredentialLoading}
							onClick={createSync}
							size="large"
							disabled={isNextButtonDisabled}
						/>
					)}
					{current > 0 && (
						<CustomButton
							title={"prev"}
							onClick={prev}
							size="large"
							disabled={false}
							style={{
								marginLeft: 20,
							}}
						/>
					)}
				</div>
			</StepCpn>
		</>
	);
};

export default NewSync;
