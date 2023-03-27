/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { AntDesignOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import EmptyCpn from "src/components/EmptyCpn";
import PageLayout from "src/components/Layout/PageLayout";
import TableCpn from "src/components/Table";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import routes from "src/constants/routes";
import { useFetchCredentialsQuery } from "src/store/api/apiSlice";
import { capitalizeFirstLetter } from "src/utils/lib";

const Connection = (props) => {
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	const router = useRouter();

	const { data, isError, error } = useFetchCredentialsQuery({
		workspaceId,
	});

	const [sourceConnections, setSourceConnections] = useState([]);
	const [destinatonConnections, setDestinationConnections] = useState([]);
	const [connectionsLoading, setConnectionsLoading] = useState(true);

	const getConnectorConfig = (connector) => {
		const config = {
			id: connector.id,
			name: connector.name,
			config: connector.connector_config,
			type: connector.connector_type.split("_")[1],
		};
		return config;
	};

	useEffect(() => {
		if (data) {
			let sources = [];
			let destinations = [];
			data.forEach((connector) => {
				const connectorType = connector.connector_type.split("_")[0];
				if (connectorType === "SRC") {
					sources.push(getConnectorConfig(connector));
				}
				if (connectorType === "DEST") {
					destinations.push(getConnectorConfig(connector));
				}
			});
			setSourceConnections(sources);
			setDestinationConnections(destinations);
			setConnectionsLoading(false);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			console.log("Error:-");
			setConnectionsLoading(false);
		}
	}, [isError]);

	const connectionColumns = [
		{
			title: "Name",
			dataIndex: "name",
		},
		{
			title: "Connector",
			dataIndex: "type",
			render: (type) => {
				return (
					<>
						<Image
							src={`/connectors/${type.toLowerCase()}.svg`}
							alt="me"
							width="32"
							height="32"
							style={{
								marginRight: 10,
							}}
						/>
						{capitalizeFirstLetter(type.toLowerCase())}
					</>
				);
			},
		},
	];

	const createConnection = useCallback((type) => {
		router.push({
			pathname: `/spaces/${workspaceId}/connections/new-connection`,
			query: { connector_type: type },
		});
	}, []);

	const navigateToDetails = (record) => {
		//console.log("navigating to details:-", record);
	};

	const onChange = (pagination, filters, sorter, extra) => {
		//console.log("params", pagination, filters, sorter, extra);
	};

	const displayTableCpn = (loading, data, onChange, onClick) => {
		return (
			<TableCpn
				loading={loading}
				columns={connectionColumns}
				data={data}
				onChange={onChange}
				onClick={onClick}
			/>
		);
	};

	const displayEmptyCpn = (title, btnTitle, onClick, type) => {
		return (
			<EmptyCpn
				title={title}
				btnTitle={btnTitle}
				onClick={() => onClick(type)}
				icon={<AntDesignOutlined />}
			/>
		);
	};

	return (
		<PageLayout
			displayHeader={true}
			headerTitle={
				sourceConnections.length > 0
					? appConstants.WAREHOUSES_TITLE
					: routes.CONNECTIONS_ROUTE
			}
			buttonTitle={
				sourceConnections.length > 0
					? buttons.NEW_WAREHOUSE_BUTTON
					: buttons.NEW_CONNECTION_BUTTON
			}
			displayCreateBtn={sourceConnections.length > 0}
			onClick={() => createConnection("SRC")}
		>
			{sourceConnections.length > 0 && (
				<>
					{displayTableCpn(
						connectionsLoading,
						sourceConnections,
						onChange,
						navigateToDetails
					)}
					<PageLayout
						layoutStyles={"pl-0 pr-0"}
						headerTitle={appConstants.DESTINATIONS_TITLE}
						buttonTitle={
							destinatonConnections.length > 0
								? buttons.NEW_DESTINATION_BUTTON
								: buttons.NEW_CONNECTION_BUTTON
						}
						displayCreateBtn={destinatonConnections.length > 0}
						onClick={() => createConnection("DEST")}
					>
						{destinatonConnections.length < 1 &&
							displayEmptyCpn(
								appConstants.EMPTY_DEST_CONNECTIONS,
								buttons.NEW_DESTINATION_BUTTON,
								createConnection,
								"DEST"
							)}
						{destinatonConnections.length > 0 &&
							displayTableCpn(
								connectionsLoading,
								destinatonConnections,
								onChange,
								navigateToDetails
							)}
					</PageLayout>
				</>
			)}
			{sourceConnections.length < 1 &&
				displayEmptyCpn(
					appConstants.NO_CONNECTIONS,
					buttons.NEW_CONNECTION_BUTTON,
					createConnection,
					"SRC"
				)}
		</PageLayout>
	);
};

const propTypes = {
	connections: PropTypes.array,
};

const defaultProps = {
	connections: [],
};

Connection.propTypes = propTypes;

Connection.defaultProps = defaultProps;

export default Connection;
