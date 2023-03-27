/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Switch } from "antd";
import Image from "next/image";
import { useSelector } from "react-redux";

import EmptyCpn from "src/components/EmptyCpn";
import PageLayout from "src/components/Layout/PageLayout";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import routes from "src/constants/routes";
import {
	useFetchSyncsQuery,
	useLazyToggleSyncQuery,
} from "src/store/api/apiSlice";
import { capitalizeFirstLetter, getConnectorSrc } from "src/utils/lib";
import TableCpn from "src/components/Table";
import ErrorCpn from "src/components/ErrorCpn";
import errors from "src/constants/errors";
import Loading from "src/components/Loading";
import { DashboardOutlined } from "@ant-design/icons";

const Syncs = (props) => {
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	const router = useRouter();
	const [syncs, setSyncs] = useState([]);
	const { data, isLoading, isError, error, refetch } = useFetchSyncsQuery(
		{
			workspaceId,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const [
		toggleSync,
		{
			data: updateSyncData,
			isLoading: updateSyncLoading,
			isError: updateSyncisError,
			error: updateSyncError,
		},
	] = useLazyToggleSyncQuery();

	useEffect(() => {
		if (data) {
			console.log("Syncs data:_", data);
			setSyncs(data);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			console.log("error:_", error);
			ErrorCpn(error, errors.ERROR_401);
		}
	}, [isError]);

	useEffect(() => {
		if (updateSyncData) {
			refetch();
		}
	}, [updateSyncData]);

	const navigate = useCallback(() => {
		router.push(`/spaces/${workspaceId}/syncs/new-sync`);
	}, []);

	const handleSwitchChange = (val, event, data) => {
		event.stopPropagation();
		const payload = {
			config: {
				sync_id: data.id,
			},
			enable: val,
			workspaceId: workspaceId,
		};
		toggleSync(payload);
	};

	const syncColumns = [
		{
			title: "Sync",
			dataIndex: "name",
			render: (name) => {
				return (
					<>
						<span>{capitalizeFirstLetter(name)}</span>
					</>
				);
			},
		},
		{
			title: "Warehouse",
			dataIndex: "source",
			render: (source) => {
				const type = source.credential.connector_type.split("_")[1];
				return (
					<>
						<Image
							src={getConnectorSrc(type)}
							alt="me"
							width="32"
							height="32"
							style={{
								marginRight: 10,
							}}
						/>
						{source.name}
					</>
				);
			},
		},
		{
			title: "Destination",
			dataIndex: "destination",
			render: (destination) => {
				const type =
					destination.credential.connector_type.split("_")[1];
				return (
					<>
						<Image
							src={getConnectorSrc(type)}
							alt="me"
							width="32"
							height="32"
							style={{
								marginRight: 10,
							}}
						/>
						{destination.name}
					</>
				);
			},
		},
		{
			title: "Schedule",
			dataIndex: "schedule",
			render: (schedule) => {
				let interval = 0;
				if (schedule.run_interval) {
					interval = Math.ceil(schedule.run_interval / 60000);
				}
				let sufix = "minutes";
				if (interval < 2) {
					sufix = "minute";
				}
				return (
					<>
						<span>{`Every ${interval} ${sufix}`}</span>
					</>
				);
			},
		},
		{
			title: "Enabled",
			dataIndex: "status",
			render: (status, data) => {
				const isEnabled = status === "active";
				return (
					<>
						<Switch
							checked={isEnabled}
							onChange={(checked, event) =>
								handleSwitchChange(checked, event, data)
							}
						/>
					</>
				);
			},
		},
	];

	const onChange = (pagination, filters, sorter, extra) => {
		//console.log("params", pagination, filters, sorter, extra);
	};

	const navigateToSyncRuns = (record) => {
		router.push(`/spaces/${workspaceId}/syncs/${record.id}/runs`);
	};

	return (
		<PageLayout
			headerTitle={routes.SYNCS_ROUTE}
			buttonTitle={buttons.NEW_SYNC_BUTTON}
			displayCreateBtn={syncs.length > 0}
			onClick={navigate}
		>
			{isLoading && <Loading loading={true} />}
			{!isLoading && syncs.length > 0 && (
				<TableCpn
					loading={isLoading || updateSyncLoading}
					columns={syncColumns}
					data={syncs}
					onChange={onChange}
					onClick={navigateToSyncRuns}
					pageSize={10}
				/>
			)}
			{!isLoading && syncs.length < 1 && (
				<EmptyCpn
					title={appConstants.NO_SYNCS}
					btnTitle={buttons.NEW_SYNC_BUTTON}
					onClick={navigate}
					icon={<DashboardOutlined />}
				/>
			)}
		</PageLayout>
	);
};

export default Syncs;
