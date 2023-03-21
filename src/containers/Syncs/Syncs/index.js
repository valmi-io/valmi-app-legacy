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

const Syncs = (props) => {
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	const router = useRouter();
	const [syncs, setSyncs] = useState([]);
	const { data, isLoading, isError, error, refetch } = useFetchSyncsQuery({
		workspaceId,
	});

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
			console.log("Syncs error:-", error.data);
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
			title: "NAME",
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
			title: "WAREHOUSE NAME",
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
			title: "DESTINATION NAME",
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
			title: "SCHEDULE",
			dataIndex: "schedule",
			render: (schedule) => {
				let interval = 0;
				if (schedule.run_interval) {
					interval = schedule.run_interval / 60000;
				}
				return (
					<>
						<span>{interval}</span>
					</>
				);
			},
		},
		{
			title: "ENABLED",
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

	const navigateToSyncDetails = (record) => {
		console.log("navigating to details:-", record);
		router.push(
			`/spaces/55c39a0b-037d-406c-a1ac-00393b055f18/syncs/${record.id}/status`
		);
	};

	return (
		<PageLayout
			headerTitle={routes.SYNCS_ROUTE}
			buttonTitle={buttons.NEW_SYNC_BUTTON}
			displayCreateBtn={syncs.length > 0}
			onClick={navigate}
		>
			{syncs.length > 0 && (
				<TableCpn
					loading={isLoading || updateSyncLoading}
					columns={syncColumns}
					data={syncs}
					onChange={onChange}
					onClick={navigateToSyncDetails}
				/>
			)}
			{syncs.length < 1 && (
				<EmptyCpn
					title={appConstants.NO_SYNCS}
					btnTitle={buttons.NEW_SYNC_BUTTON}
					onClick={navigate}
				/>
			)}
		</PageLayout>
	);
};

export default Syncs;
