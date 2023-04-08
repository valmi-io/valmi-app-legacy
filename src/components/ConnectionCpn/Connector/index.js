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

const ConnectorCpn = (props) => {
	const { handleConnectorSelected, type } = props;
	const [selectedConnector, setSelectedConnector] = useState(null);
	const [connectors, setConnectors] = useState(null);
	const { data, isLoading, isError, error } = useFetchConnectorsQuery();

	useEffect(() => {
		if (data) {
			console.log("Connector data:_", data);
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
		return (
			<div className="d-flex justify-content-center">
				<Spin tip="Please wait..." />;
			</div>
		);
	}

	return (
		<div className="d-flex flex-column">
			<Row gutter={12}>
				{connectors &&
					connectors.map((connector) => {
						const type = connector.type
							.split("_")
							.slice(1)
							.join("_");

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
										padding: 20,
										cursor: "pointer",
										borderRadius:
											selectedConnector === connector.type
												? 15
												: 10,
									}}
									className={`${
										selectedConnector === connector.type
											? "bg-primary color-white"
											: "bg-white"
									} "d-flex w-100 align-items-center justify-content-start"`}
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

// const propTypes = {
// 	type: PropTypes.oneOf(["SRC", "DEST"]).isRequired,
// 	handleConnectorSelected: PropTypes.func,
// };

// const defaultProps = {
// 	type: "SRC",
// };

// ConnectorCpn.propTypes = propTypes;
// ConnectorCpn.defaultProps = defaultProps;

export default ConnectorCpn;
