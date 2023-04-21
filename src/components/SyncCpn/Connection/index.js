/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, March 21st 2023, 2:07:22 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from "react";
import DropdownCpn from "src/components/Dropdown";
import { useLazyDiscoverConnectorQuery } from "src/store/api/apiSlice";
import { connectorTypes } from "src/utils/lib";

const ConnectionCpn = ({
	connections,
	workspaceId,
	connectorType,
	setConnectorCatalog,
}) => {
	const [connectorSchema, setConnectorSchema] = useState("");
	const [connectorNamespace, setConnectorNamespace] = useState("");
	const [fetchCatalog, setFetchCatalog] = useState(true);
	const [connectorStreams, setConnectorStreams] = useState([]);
	const [connectorConfig, setConnectorConfig] = useState(null);
	const [discoverConnector, setDiscoverConnector] = useState(false);

	const [extConfigParams, setExtConfigParams] = useState({});

	const [discoverConnectorSpec, { data, isError }] =
		useLazyDiscoverConnectorQuery();

	useEffect(() => {
		return () => {
			resetConnection();
		};
	}, [connections]);

	useEffect(() => {
		if (data) {
			const { catalog } = data;
			if (connectorType === connectorTypes.DESTINATION) {
				const { sinks } = catalog;
				configureConnector(sinks);
			} else {
				const { more, streams, type } = catalog;
				setFetchCatalog(more);
				console.log("type:_", type);
				if (connectorSchema !== type) {
					console.log("if ===========");
					setConnectorSchema(type);
					const stream = {
						type,
						streams,
					};
					setConnectorStreams([...connectorStreams, stream]);
				}
			}
			setDiscoverConnector(false);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			setDiscoverConnector(false);
		}
	}, [isError]);

	const onConnectorSelected = (connector) => {
		const {
			connections: { connector_config, connector_type, id, name },
		} = connector;
		const payload = {
			config: connector_config,
			connectorType: connector_type,
			workspaceId,
		};
		const config = {
			payload,
			id,
			name,
		};
		setConnectorConfig(config);
		fetchConnectorCatalog(payload, connector);
	};

	const onStreamSelected = (stream) => {
		const {
			payload: { config, connectorType, workspaceId },
		} = connectorConfig;
		if (connectorSchema === "namespace") {
			setConnectorNamespace(stream.label);
		}
		const obj = {};
		obj[connectorSchema] = stream.label;
		const extendedParams = {...extConfigParams, ...obj}
		setExtConfigParams(extendedParams)
		console.log("extConfig",extConfigParams);
		console.log("obj", obj)
		const catalog = Object.assign({}, config, extendedParams);
		const payload = {
			config: catalog,
			connectorType,
			workspaceId,
		};
		fetchConnectorCatalog(payload, stream);
	};

	const fetchConnectorCatalog = (payload, catalog) => {
		if (fetchCatalog) {
			setDiscoverConnector(true);
			discoverConnectorSpec(payload);
		} else {
			const { connections } = catalog;
			configureConnector(connections);
		}
	};

	const resetConnection = () => {
		setConnectorStreams([]);
		setConnectorConfig(null);
		setFetchCatalog(true);
	};

	const configureConnector = (catalog) => {
		if (connectorType === connectorTypes.SOURCE) {
			const updatedConfig = {
				...connectorConfig,
				payload: {
					...connectorConfig.payload,
					config: {
						...connectorConfig.payload.config,
						namespace: connectorNamespace,
					},
				},
			};
			setConnectorCatalog(catalog, updatedConfig);
		} else {
			setConnectorCatalog(catalog, connectorConfig);
		}
	};

	const displayDropdown = (type, onItemSelected, connections, loading) => {
		return (
			<div key={type} className="text-left">
				<span>{type}</span>
				<DropdownCpn
					onItemSelected={onItemSelected}
					connections={connections}
					loading={loading}
				/>
			</div>
		);
	};

	return (
		<div
			style={{
				//textAlign: "left",
				borderRadius: 10,
			}}
		>
			<div>
				{displayDropdown(
					connectorType,
					onConnectorSelected,
					connections,
					discoverConnector
				)}
				{connectorStreams.length > 0 &&
					connectorStreams.map((stream, index) => {
						return displayDropdown(
							stream.type,
							onStreamSelected,
							stream.streams,
							discoverConnector
						);
					})}
			</div>
		</div>
	);
};

export default ConnectionCpn;
