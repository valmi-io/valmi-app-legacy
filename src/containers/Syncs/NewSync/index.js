/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { message, notification, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CustomButton from "src/components/Button/Button";
import CardCpn from "src/components/Card";
import ErrorCpn from "src/components/ErrorCpn";
import PageLayout from "src/components/Layout/PageLayout";
import StepCpn from "src/components/Step";
import ConnectionCpn from "src/components/SyncCpn/Connection";
import ConnectionMapping from "src/components/SyncCpn/Mapping";
import ConnectionScheduleCpn from "src/components/SyncCpn/Schedule";
import Title from "src/components/Title";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import errors from "src/constants/errors";
import {
	useFetchCredentialsQuery,
	useLazyAddCredentialsQuery,
} from "src/store/api/apiSlice";
import { connectorTypes, getRandomWord } from "src/utils/lib";

const NewSync = (props) => {
	const router = useRouter();
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	const { data, isLoading, isError, error } = useFetchCredentialsQuery({
		workspaceId,
	});

	const [
		createSync,
		{
			data: createSyncData,
			isLoading: isCreateSyncLoading,
			isError: isCreateSyncError,
			error: createSyncError,
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
		if (createSyncData) {
			console.log("=============================");
			message.success("Sync created successfully!");
			router.push(`/spaces/${workspaceId}/syncs`);
		}
	}, [createSyncData]);

	useEffect(() => {
		if (isCreateSyncError) {
			console.log("Create sync error:_", createSyncError);
			if (createSyncError.status === 401) {
				ErrorCpn(createSyncError, errors.SYNC_FAILED);
			} else {
				notification.error({
					message: createSyncError.data.detail?.[0].msg,
					description: createSyncError.data.detail?.[0].msg,
				});
			}
		}
	}, [isCreateSyncError]);

	useEffect(() => {
		if (isError) {
			console.log("is Error:-", isError);
		}
	}, [isError]);

	useEffect(() => {
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

	const setCreateSyncPayload = () => {
		const payload = {
			src: updatedSourceMeta,
			dest: updatedDestMeta,
			schedule: {
				run_interval: syncInterval * 60 * 1000, // inteval in milliseconds.
			},
			syncName: getRandomWord(),
			workspaceId: workspaceId,
		};
		createSync(payload);
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
		let sourceProperties = {};
		let mappingProperties = {};
		for (let i = 0; i < destinationFields.length; i++) {
			const type = { type: destinationFields[i].type };
			sourceProperties[destinationFields[i].name] = type;
			mappingProperties[destinationFields[i].name] =
				destinationFields[i].destField;
		}
		const { destinationSyncMode, warehouseSyncMode, primaryKey } =
			mappingModes;

		const hasIdKey = sourceProperties.hasOwnProperty(primaryKey.name);
		if (!hasIdKey) {
			sourceProperties[primaryKey.name] = {
				type: primaryKey.type,
			};
		}
		const sourcePayload = {
			catalog: {
				streams: [
					{
						sync_mode: warehouseSyncMode,
						destination_sync_mode: destinationSyncMode,
						id_key: primaryKey.name,
						stream: {
							name,
							supported_sync_modes,
							json_schema: {
								$schema: json_schema.$schema,
								properties: sourceProperties,
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

	if (isLoading) {
		return <Spin tip="Please wait..." />;
	}

	return (
		<PageLayout
			displayHeader={false}
			containerStyles={{
				width: "80%",
				height: "100%",
			}}
		>
			<Title title={"Create Sync"} level={4} classnames={"mb-3"} />
			<StepCpn steps={steps} current={current}>
				<div className="d-flex mt-3 justify-content-end">
					{current > 0 && (
						<CustomButton
							title={"Back"}
							onClick={prev}
							size="small"
							type="text"
							disabled={false}
							className={"mr-3 color-primary"}
						/>
					)}
					{current < steps.length - 1 && (
						<CustomButton
							title={buttons.NEXT_BUTTON}
							onClick={next}
							size="small"
							disabled={isNextButtonDisabled}
						/>
					)}

					{current === steps.length - 1 && (
						<CustomButton
							title={buttons.CREATE_BUTTON}
							loading={isCreateSyncLoading}
							onClick={setCreateSyncPayload}
							size="small"
							disabled={isNextButtonDisabled}
						/>
					)}
				</div>
			</StepCpn>
		</PageLayout>
	);
};

export default NewSync;
