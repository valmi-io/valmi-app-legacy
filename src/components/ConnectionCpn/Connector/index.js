/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import PropTypes from "prop-types";
import { Card, Col, Row, Spin } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFetchConnectorsQuery } from "src/store/api/apiSlice";
import Title from "src/components/Title";

const ConnectorCpn = (props) => {
	const { handleConnectorSelected, type } = props;
	const [selectedConnector, setSelectedConnector] = useState(null);
	const [connectors, setConnectors] = useState(null);
	const { data, isLoading, isError, error } = useFetchConnectorsQuery();

	useEffect(() => {
		if (data) {
			console.log("data:_", data);
			if (data[type]) {
				setConnectors(data[type]);
			}
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			console.log("Error while fetching connectors:-", error.data);
		}
	}, [isError]);

	if (isLoading) {
		return <Spin tip="Please wait..." />;
	}

	return (
		<div className="d-flex flex-column ml-2">
			<Row gutter={12}>
				{connectors &&
					connectors.map((connector) => {
						const type = connector.type.split("_")[1];
						return (
							<Col
								key={connector.type}
								span={12}
								style={{
									padding: 10,
								}}
							>
								<Card.Grid
									onClick={() => {
										if (
											selectedConnector === connector.type
										) {
											setSelectedConnector(null);
											return handleConnectorSelected(
												null
											);
										} else {
											setSelectedConnector(
												connector.type
											);
											return handleConnectorSelected(
												connector
											);
										}
									}}
									style={{
										width: "100%",
										padding: 20,
										backgroundColor:
											selectedConnector === connector.type
												? "#19bc9b"
												: "white",
										cursor: "pointer",
										display: "flex",
										justifyContent: "flex-start",
										alignItems: "center",
										color:
											selectedConnector ===
												connector.type && "white",
										borderRadius:
											selectedConnector === connector.type
												? 15
												: 10,
									}}
								>
									<Image
										src={`/connectors/${type.toLowerCase()}.svg`}
										alt="me"
										width="32"
										height="32"
										style={{
											marginRight: 10,
										}}
									/>
									{connector.display_name}
								</Card.Grid>
							</Col>
						);
					})}
			</Row>
		</div>
	);
};

const propTypes = {
	type: PropTypes.oneOf(["SRC", "DEST"]).isRequired,
	handleConnectorSelected: PropTypes.func,
};

const defaultProps = {
	type: "SRC",
};

ConnectorCpn.propTypes = propTypes;
ConnectorCpn.defaultProps = defaultProps;

export default ConnectorCpn;
