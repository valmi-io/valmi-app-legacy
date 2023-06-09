/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomButton from "src/components/Button/Button";
import DropdownCpn from "src/components/Dropdown";
import TableCpn from "src/components/Table";
import Title from "src/components/Title";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import { connectorTypes, getConnectorSrc } from "src/utils/lib";

const ConnectionMapping = (props) => {
	const {
		warehouseMeta = {},
		destinationMeta = {},
		setMappingMeta,
		destinationFields,
		setDestinationFields,
	} = props;

	const {
		catalog: {
			supported_sync_modes,
			json_schema: { properties },
		},
	} = warehouseMeta;
	const { catalog: destCatalog } = destinationMeta;
	const [warehouseFields, setWarehouseFields] = useState([]);
	const [selectedField, setSelectedField] = useState(null);
	const [warehouseSyncMode, setWarehouseSyncMode] = useState("");
	const [destSyncmode, setDestSyncmode] = useState("");
	const [destinationSupportedSyncs, setDestinationSupportedSyncs] = useState(
		[]
	);
	const [primaryKey, setPrimaryKey] = useState(null);
	const [fields, setFields] = useState([]);

	useEffect(() => {
		return () => {
			setWarehouseFields([]);
		};
	}, [warehouseMeta]);

	useEffect(() => {
		if (destCatalog.length > 0) {
			const syncModes = destCatalog[0].supported_destination_sync_modes;
			setDestinationSupportedSyncs(syncModes);
		} else {
			setDestinationSupportedSyncs["upsert"];
		}
	}, []);

	useEffect(() => {
		const columns = Object.keys(properties);
		let fields = [];
		for (let i = 0; i < columns.length; i++) {
			const dtype = properties[columns[i]].type
			let prop = {
				id: i,
				name: columns[i],
				type: dtype,
			};
			fields.push(prop);
		}
		setWarehouseFields(fields);
	}, []);

	const getFieldObj = (data) => {
		const field = {
			id: destinationFields.length,
			name: data.name ? data.name : "",
			type: "uuid",
			destField: "",
			delete: data.delete,
		};
		return field;
	};

	const addField = () => {
		const newField = getFieldObj({ delete: true });
		setDestinationFields([...destinationFields, newField]);
		setFields([...fields, newField]);
	};

	const setWarehouseField = (property) => {
		const {
			connections: { name, type },
		} = property;
		setSelectedField({
			name,
			type,
		});
	};

	const setIdKey = (property) => {
		const {
			connections: { name, type },
		} = property;
		console.log("Set ID key:_", name, type);
		setPrimaryKey({ name, type });
		setMappingMeta(warehouseSyncMode, destSyncmode, { name, type });
	};

	const setSyncMode = (mode, type) => {
		const { connections: syncMode } = mode;
		if (type === connectorTypes.DEST) {
			setMappingMeta(warehouseSyncMode, syncMode, primaryKey);
			setDestSyncmode(syncMode);
		} else {
			setWarehouseSyncMode(syncMode);
			setMappingMeta(syncMode, destSyncmode, primaryKey);
		}
	};

	const connectionColumns = [
		{
			title: appConstants.WAREHOUSE_FIELD,
			dataIndex: "name",
			width: "40%",
			render: (field) => {
				return (
					<DropdownCpn
						onItemSelected={setWarehouseField}
						connections={warehouseFields}
						loading={false}
					/>
				);
			},
		},

		{
			title: appConstants.DESTINATION_FIELD,
			dataIndex: "destField",
			width: "40%",
			render: (field, data) => {
				return (
					<Input
						value={field}
						onChange={(e) => {
							e.preventDefault();
							let arr = destinationFields.map((obj) => {
								if (obj.id === data.id) {
									return {
										...obj,
										destField: e.target.value,
										type: selectedField
											? selectedField.type
											: obj.type,
										name: selectedField
											? selectedField.name
											: obj.name,
									};
								} else {
									return obj;
								}
							});
							setDestinationFields(arr);
							setFields(arr);
							setSelectedField(null);
						}}
					/>
				);
			},
		},
		{
			title: appConstants.DELETE_TEXT,
			dataIndex: "delete",
			width: "20%",
			render: (type, data) => {
				if (type)
					return (
						<div className="d-flex justify-content-center">
							<DeleteOutlined
								style={{ fontSize: 18 }}
								onClick={() => {
									let index = data.id;
									let newArray = destinationFields.filter(
										(obj) => obj.id !== index
									);
									setDestinationFields(newArray);
									setFields(newArray);
								}}
							/>
						</div>
					);
			},
		},
	];

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	const displayDropdown = (title, onItemSelected, connections) => {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "space-between",
					marginBottom: 10,
				}}
			>
				<span>{title}</span>
				<DropdownCpn
					onItemSelected={onItemSelected}
					style={{ width: "100%", textAlign: "left" }}
					connections={connections}
					loading={false}
				/>
			</div>
		);
	};

	const getConnectorImage = ({ type, size = 30 }) => {
		return (
			<Image
				src={getConnectorSrc(type)}
				alt={`connector${type}`}
				width={size}
				height={size}
				className="mr-2"
			/>
		);
	};

	return (
		<div>
			<div
				style={{
					width: "100%",
					padding: 20,
					backgroundColor: "white",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div className="d-flex align-items-center mt-3">
					<div className="d-flex align-items-center">
						{getConnectorImage({
							type: warehouseMeta.type,
						})}
						<Title
							title={warehouseMeta.name}
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
							type: destinationMeta.type,
						})}
						<Title
							title={destinationMeta.name}
							classnames={"font-weight-normal"}
							level={5}
						/>
					</div>
				</div>
			</div>
			{displayDropdown(
				appConstants.WAREHOUSE_SYNC_MODE,
				(mode) => setSyncMode(mode, connectorTypes.SRC),
				supported_sync_modes
			)}
			{displayDropdown(
				appConstants.DESTINATION_SYNC_MODE,
				(mode) => setSyncMode(mode, connectorTypes.DEST),
				destinationSupportedSyncs
			)}
			{displayDropdown(appConstants.ID_TEXT, setIdKey, warehouseFields)}
			<TableCpn
				loading={false}
				columns={connectionColumns}
				data={destinationFields}
				bordered
				onChange={onChange}
				onClick={() => {}}
				displayPagination={false}
			/>
			<div className="d-flex mt-3 justify-content-start">
				<CustomButton
					title={buttons.ADD_FIELD_BUTTON}
					onClick={addField}
					size="small"
					disabled={false}
				/>
			</div>
		</div>
	);
};

export default ConnectionMapping;
