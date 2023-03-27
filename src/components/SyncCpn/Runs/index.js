/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, March 25th 2023, 1:10:30 pm
 * Author: Nagendra S @ valmi.io
 */

import {
	ArrowRightOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	LoadingOutlined,
} from "@ant-design/icons";
import { Badge, Card, List } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomButton from "src/components/Button/Button";
import ErrorDialog from "src/components/ErrorDialog";
import Title from "src/components/Title";
import errors from "src/constants/errors";
import { useLazyGetSyncRunsByIdQuery } from "src/store/api/apiSlice";
import { getConnectorSrc } from "src/utils/lib";
import ErrorCpn from "src/components/ErrorCpn";

const SyncRuns = ({ syncID, workspaceID }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [runsData, setRunsData] = useState([]);
	const [runError, setRunError] = useState(false);
	const [runErrorMsg, setRunErrorMsg] = useState(null);
	const [loadMoreButton, showLoadMoreButton] = useState(false);
	const [lastSync, setLastSync] = useState(new Date().toISOString());
	const [fetchMore, setFetchMore] = useState(true);
	const [isRefetching, setIsRefetching] = useState(false);

	const [getSyncRuns, { data, isLoading, isError, error }] =
		useLazyGetSyncRunsByIdQuery();

	useEffect(() => {
		const intervalID = setInterval(() => {
			if (currentPage === 1) {
				if (runsData) {
					setIsRefetching(true);
					console.log("Start refetching:-");
					setLastSync(new Date().toISOString());
					setFetchMore(true);
				}
			}
		}, [3000]);

		const lastPage = Math.ceil(runsData.length / 15);
		if (lastPage > 1 && lastPage === currentPage) {
			showLoadMoreButton(true);
		} else {
			showLoadMoreButton(false);
		}
		return () => {
			clearInterval(intervalID);
		};
	}, [currentPage]);

	useEffect(() => {
		const fetchSyncRuns = () => {
			let syncPayload = {
				syncId: syncID,
				workspaceId: workspaceID,
				before: lastSync,
				limit: 25,
			};
			getSyncRuns(syncPayload);
		};
		if (fetchMore) {
			fetchSyncRuns();
		}
	}, [lastSync, fetchMore]);

	useEffect(() => {
		if (data) {
			console.log("runs data:_", data);
			if (isRefetching) {
				setRunsData(data);
			} else {
				setRunsData((prevData) => [...prevData, ...data]);
				showLoadMoreButton(false);
				setFetchMore(false);
			}
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			setFetchMore(false);
			ErrorCpn(error, errors.ERROR_401);
		}
	}, [isError]);

	const handleLoadMore = () => {
		const lastSyncRun = runsData[runsData.length - 1].run_at;
		setLastSync(lastSyncRun);
		setFetchMore(true);
	};

	const getConnectorImage = ({ type, size = 60 }) => {
		return (
			<Image
				src={getConnectorSrc(type.split("_")[1]).toLowerCase()}
				alt="me"
				width={size}
				height={size}
				className="mr-3"
			/>
		);
	};

	const displaySrcMetrics = (metrics) => {
		let metricObj = {};
		for (let key in metrics) {
			const prop = key.split("$")[0];
			if (metricObj[prop]) {
				metricObj[prop] = metricObj[prop] + metrics[key];
			} else {
				metricObj[prop] = metrics[key];
			}
		}
		const {
			invalid = 0,
			valid = 0,
			total = 0,
			new: newData = 0,
			success = 0,
		} = metricObj;

		return (
			<div className="d-flex justify-content-between align-items-center text-center">
				{displayMetricsLayout("Total", total)}
				{displayMetricsLayout("New", newData)}
				{displayMetricsLayout("Invalid", invalid)}
				{displayMetricsLayout("Valid", valid)}
				{displayMetricsLayout("Fetched", success)}
			</div>
		);
	};

	const displayDestMetrics = (metrics) => {
		const { success = 0 } = metrics;

		return (
			<div className="d-flex w-75 justify-content-between align-items-center text-center">
				{displayMetricsLayout("Delivered", success)}
				{displayMetricsLayout("Rejected", 0)}
			</div>
		);
	};

	const displayMetricsLayout = (title, count) => {
		return (
			<div className="d-flex align-items-center">
				<span className="fs-sm">{title}</span>
				<span className="ml-1">{"-"}</span>
				<span className="fs-sm ml-1">{count}</span>
			</div>
		);
	};

	const displayRunLayout = (
		connectorType,
		status,
		metrics,
		runStatus,
		error
	) => {
		return (
			<div className="d-flex w-100 flex-column">
				<div className="d-flex align-items-center text-center">
					{getConnectorImage({
						type: connectorType,
						size: 15,
					})}
					<Title
						classnames={"font-weight-light mr-2"}
						title={status}
						level={5}
					/>
					{runStatus === "success" && (
						<CheckCircleOutlined className="color-success" />
					)}
					{runStatus === "failed" && !error && (
						<CheckCircleOutlined className="color-success" />
					)}
					{error && <CloseCircleOutlined className="color-errror" />}
				</div>
				{connectorType.split("_")[0] === "SRC"
					? displaySrcMetrics(metrics)
					: displayDestMetrics(metrics)}
			</div>
		);
	};

	function convertUTCDateToLocalDate(date) {
		var newDate = new Date(
			date.getTime() + date.getTimezoneOffset() * 60 * 1000
		);

		var offset = date.getTimezoneOffset() / 60;
		var hours = date.getHours();

		newDate.setHours(hours - offset);

		return newDate;
	}

	const renderSyncRuns = (data) => {
		const date = convertUTCDateToLocalDate(new Date(data.run_at));

		let srcStatus = "";
		let destStatus = "";
		let runStatus = "";
		let sourceError = false;
		let destError = false;
		let errorMsg = null;
		let runMetrics = { src: {}, dest: {} };
		const { extra = null, metrics = null, status } = data;

		if (!extra || !metrics) {
			if (status === "scheduled") {
				srcStatus = "Preparing Data...";
				destStatus = "Delivering...";
				runStatus = status;
			}
			if (status === "running") {
				srcStatus = "Extracting Data...";
				destStatus = "Delivering...";
				runStatus = status;
			}
		} else {
			const { dest: destMetrics = null, src: srcMetrics = null } =
				metrics;

			if (extra.hasOwnProperty("run_manager") && extra.run_manager) {
				const {
					status: { status: run_manager_status, message },
				} = extra.run_manager;
				if (run_manager_status === "failed") {
					errorMsg = message;
					if (!destMetrics) {
						destError = true;
						destStatus = "Failed";
					} else {
						destStatus = "Delivered";
					}
					if (!srcMetrics) {
						sourceError = true;
						srcStatus = "Failed";
					} else {
						srcStatus = "Fetched";
					}
				} else {
					srcStatus = "Fetched";
					destStatus = "Delivered";
				}
				runStatus = run_manager_status;
				runMetrics = {
					src: srcMetrics ? srcMetrics : {},
					dest: destMetrics ? destMetrics : {},
				};
			} else {
				srcStatus = "Extracting Data...";
				destStatus = "Delivering...";
				runStatus = status;
			}
		}

		return (
			<Card.Grid
				hoverable={false}
				style={{
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
				}}
				className="bg-white d-flex w-100 cursor-pointer"
			>
				<div className="d-flex w-80">
					{displayRunLayout(
						"SRC_POSTGRES",
						srcStatus,
						runMetrics.src,
						runStatus,
						sourceError
					)}
				</div>
				<div className="d-flex w-25 align-items-center justify-content-center ml-4">
					<ArrowRightOutlined
						style={{
							fontSize: 15,
							color: "grey",
						}}
					/>
				</div>
				<div className="d-flex w-60 ml-4 ">
					{displayRunLayout(
						"DEST_WEBHOOK",
						destStatus,
						runMetrics.dest,
						runStatus,
						destError
					)}
				</div>
				<div className="d-flex w-30 ml-4 align-items-center">
					{/* <span>Run at</span> */}
					<span>
						{date.toDateString() +
							" " +
							date.getHours() +
							":" +
							date.getMinutes()}
					</span>
				</div>
				<div className="d-flex w-30 flex-column align-items-center justify-content-center">
					<div className="d-flex">
						<Badge
							count={runStatus}
							style={{
								backgroundColor:
									runStatus === "failed"
										? "#f5222d"
										: runStatus === "success"
										? "#42ba96"
										: "#faad14",
							}}
						/>
						{runStatus === "running" && (
							<LoadingOutlined className=" ml-2" />
						)}
					</div>

					{runStatus === "failed" && (
						<CustomButton
							title="Show error"
							size="small"
							onClick={() => {
								setRunErrorMsg(errorMsg);
								setRunError(true);
							}}
							className="mt-2"
						/>
					)}
				</div>
			</Card.Grid>
		);
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	return (
		<>
			{runError && (
				<ErrorDialog
					error={runErrorMsg}
					onClose={() => {
						setRunError(false);
						setRunErrorMsg(null);
					}}
				/>
			)}
			<div className="d-flex justify-content-between">
				<Title title={"Run History"} level={4} classnames={"mb-3"} />
				<CustomButton
					title="Stop sync"
					size="small"
					loading={false}
					onClick={() => {}}
				/>
			</div>
			<List
				pagination={{
					position: "bottom",
					defaultPageSize: 15,
					current: currentPage,
					onChange: handlePageChange,
				}}
				dataSource={runsData}
				renderItem={renderSyncRuns}
				loading={isLoading}
				bordered
				style={{
					borderRadius: 5,
				}}
			/>
			{loadMoreButton && (
				<div className="d-flex justify-content-center">
					<CustomButton
						title="Load more"
						size="small"
						loading={isLoading}
						onClick={handleLoadMore}
					/>
				</div>
			)}
		</>
	);
};

export default SyncRuns;
