/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, March 25th 2023, 1:10:18 pm
 * Author: Nagendra S @ valmi.io
 */

import { ArrowRightOutlined } from "@ant-design/icons";
import { Skeleton, Space, Switch } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import CardCpn from "src/components/Card";
import ErrorCpn from "src/components/ErrorCpn";
import Title from "src/components/Title";
import errors from "src/constants/errors";
import { useLazyGetSyncByIdQuery } from "src/store/api/apiSlice";
import { connectorTypes, getConnectorSrc } from "src/utils/lib";

const SyncDetails = ({ syncID, workspaceID }) => {
	const [toggleChecked, setToggleChecked] = useState(true);
	const [getSyncDetails, { data, isLoading, isError, error }] =
		useLazyGetSyncByIdQuery();

	useEffect(() => {
		const payload = {
			syncId: syncID,
			workspaceId: workspaceID,
		};
		getSyncDetails(payload);
	}, []);

	useEffect(() => {
		if (data) {
			console.log("Sync details data:_", data);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			ErrorCpn(error, errors.ERROR_401);
		}
	}, [isError]);

	useEffect(() => {
		if (isLoading) {
			console.log("isLoading:-", isLoading);
		}
	}, [isLoading]);

	const getConnectorImage = ({ type, size = 30 }) => {
		return (
			<Image
				src={getConnectorSrc(type.split("_")[1]).toLowerCase()}
				alt="me"
				width={size}
				height={size}
				style={{
					marginRight: 10,
				}}
			/>
		);
	};

	const handleSwitchChange = (val, event, data) => {
		event.stopPropagation();
		setToggleChecked((checked) => !checked);
	};

	const displaySyncDetails = () => {
		const { destination = {}, source = {}, name: syncName = "" } = data;
		const {
			credential: {
				connector_type: sourceConnectorType = connectorTypes.SRC,
				name: sourceName = "",
			},
		} = source;
		const {
			credential: {
				connector_type: destinationConnectorType = connectorTypes.DEST,
				name: destinationName = "",
			},
		} = destination;
		return (
			<div className="d-flex flex-column justify-content-center">
				<div className="d-flex align-items-center justify-content-between ">
					<Title
						title={syncName}
						classnames={"font-weight-light"}
						level={4}
					/>
					<Switch
						checked={toggleChecked}
						onChange={(checked, event) =>
							handleSwitchChange(checked, event)
						}
					/>
				</div>
				<div className="d-flex align-items-center mt-3">
					<div className="d-flex align-items-center">
						{getConnectorImage({
							type: sourceConnectorType,
						})}
						<Title
							title={sourceName}
							classnames={"font-weight-normal"}
							level={5}
						/>
					</div>

					<ArrowRightOutlined
						style={{ fontSize: 18 }}
						className="ml-3 mr-3"
					/>
					<div className="d-flex align-items-center">
						{getConnectorImage({
							type: destinationConnectorType,
						})}
						<Title
							title={destinationName}
							classnames={"font-weight-normal"}
							level={5}
						/>
					</div>
				</div>
			</div>
		);
	};

	return (
		<CardCpn
			containerStyles={{
				marginBottom: 20,
			}}
			loading={isLoading}
		>
			{isLoading && <Skeleton active />}
			{!isLoading && data && displaySyncDetails()}
		</CardCpn>
	);
};

export default SyncDetails;
