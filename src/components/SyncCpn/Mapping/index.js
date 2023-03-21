import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomButton from "src/components/Button/Button";
import DropdownCpn from "src/components/Dropdown";
import TableCpn from "src/components/Table";
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
	const [primaryKey, setPrimaryKey] = useState("");
	const [fields, setFields] = useState([]);

	useEffect(() => {
		return () => {
			setWarehouseFields([]);
		};
	}, [warehouseMeta]);

	useEffect(() => {
		if (destCatalog.length > 0) {
			const syncModes = destCatalog[0].supported_sync_modes;
			setDestinationSupportedSyncs(syncModes);
		} else {
			setDestinationSupportedSyncs["upsert"];
		}
	}, []);

	useEffect(() => {
		const columns = Object.entries(properties);
		let fields = [];
		for (let i = 0; i < columns.length; i++) {
			const columnType = columns[i][1].type;
			const propType = columnType.substring(
				columnType.indexOf("(") + 1,
				columnType.lastIndexOf(")")
			);
			const columnNameRegex = /<Column\s+(\w+)\s+\((.*)\)>/i;
			const match = columnType.match(columnNameRegex);

			if (match) {
				const columnName = match[1];
				let prop = {
					id: i,
					name: columnName,
					type: propType,
				};
				fields.push(prop);
			}
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
		setPrimaryKey(name);
		setMappingMeta(warehouseSyncMode, destSyncmode, name);
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
			render: (field) => {
				//if (field === "id") return <span>{field}</span>;
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
			render: (type, data) => {
				if (type)
					return (
						<DeleteOutlined
							onClick={() => {
								let index = data.id;
								let newArray = destinationFields.filter(
									(obj) => obj.id !== index
								);
								setDestinationFields(newArray);
								setFields(newArray);
							}}
						/>
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
				<Space size={8}>
					<div>
						<Image
							src={getConnectorSrc(warehouseMeta.type)}
							alt="me"
							width="32"
							height="32"
							style={{
								marginRight: 10,
							}}
						/>
						{warehouseMeta.name}
					</div>
					<ArrowRightOutlined />
					<div>
						<Image
							src={getConnectorSrc(destinationMeta.type)}
							alt="me"
							width="32"
							height="32"
							style={{
								marginRight: 10,
							}}
						/>
						{destinationMeta.name}
					</div>
				</Space>
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
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					marginTop: 20,
				}}
			>
				<CustomButton
					title={buttons.ADD_FIELD_BUTTON}
					onClick={addField}
					size="large"
					disabled={false}
				/>
			</div>
		</div>
	);
};

export default ConnectionMapping;
