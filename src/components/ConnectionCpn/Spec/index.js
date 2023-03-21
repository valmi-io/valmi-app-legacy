import { InfoCircleOutlined } from "@ant-design/icons";
import {
	Form,
	Input,
	InputNumber,
	message,
	notification,
	Space,
	Spin,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import buttons from "src/constants/buttons";
import {
	useLazyCheckAndAddConnectorSpecQuery,
	useLazyFetchConnectorSpecQuery,
} from "src/store/api/apiSlice";
import CustomButton from "../../Button/Button";
import DropdownCpn from "../../Dropdown";
import Title from "../../Title";

const SpecCpn = (props) => {
	const router = useRouter();

	const { connectorMeta, workspaceId, prev } = props;
	const [connectorSpec, setConnectorSpec] = useState([]);
	const [connectorTitle, setConnectorTitle] = useState("");
	const [destConnectorMethod, setDestConnectorMethod] = useState("");

	const [fetchConnectorSpec, { data, isLoading }] =
		useLazyFetchConnectorSpecQuery();

	const [
		checkConnectorSpec,
		{ data: specData, isLoading: checking, isError, error },
	] = useLazyCheckAndAddConnectorSpecQuery();

	useEffect(() => {
		fetchConnectorSpec({
			type: connectorMeta.type,
			workspaceId: workspaceId,
		});
	}, []);

	useEffect(() => {
		if (data) {
			console.log("Spec data:_", data);
			const {
				spec: {
					connectionSpecification: { properties, required, title },
				},
			} = data;

			const specArr = [];
			Object.keys(properties).map((key) => {
				specArr.push({
					type: key,
					value: properties[key],
					required: required.includes(key),
				});
			});
			setConnectorTitle(title);
			console.log("Spec arr:-", specArr);
			setConnectorSpec(specArr);
		}
	}, [data]);

	useEffect(() => {
		if (specData) {
			message.success("Credential created successfully");
			router.push(`/spaces/${workspaceId}/connections`);
		}
	}, [specData]);

	useEffect(() => {
		if (isError) {
			notification.error({
				message: "Invalid Credentials",
				description: error,
			});
		}
	}, [isError]);

	const checkSpec = (values) => {
		let payload = {};
		if (connectorMeta.type === "DEST_WEBHOOK") {
			const { authorizationheader, url } = values;
			payload = {
				config: {
					authorization: authorizationheader,
					url,
					method: destConnectorMethod,
				},
			};
		} else {
			const { host, database, password, port, username } = values;
			payload = {
				config: {
					host,
					port,
					database,
					user: username,
					password,
				},
			};
		}

		checkConnectorSpec({
			type: connectorMeta.type,
			workspaceId: workspaceId,
			config: payload,
			name: connectorTitle,
		});
	};

	const getInputCpn = (spec) => {
		const { value, type, required = false } = spec;
		let isEnum = false;
		if (value?.enum) {
			isEnum = true;
		}
		const {
			type: inputType,
			description = "",
			title = type,
			airbyte_secret = false,
		} = value;
		if (isEnum) {
			return (
				<Form.Item
					name={title}
					key={type}
					label={title}
					tooltip={{
						title: type,
						icon: (
							<Space size={4}>
								<span />
								<InfoCircleOutlined />
							</Space>
						),
					}}
				>
					<DropdownCpn
						onItemSelected={(val) => {
							console.log("On item selected", val);
							setDestConnectorMethod(val.label);
						}}
						connections={value.enum}
					/>
				</Form.Item>
			);
		}
		if (inputType === "integer") {
			return (
				<Form.Item
					name={title.split(" ").join("").toLowerCase()}
					key={type}
					label={title}
					tooltip={{
						title: description,
						icon: (
							<Space size={4}>
								<span />
								<InfoCircleOutlined />
							</Space>
						),
					}}
					rules={[
						{
							required: required,
							type: inputType,
							message: `The ${title} is not a valid ${inputType}!`,
						},
					]}
				>
					<InputNumber
						controls={false}
						size="large"
						style={{
							height: 50,
							width: "100%",
							display: "flex",
							alignItems: "center",
						}}
					/>
				</Form.Item>
			);
		}
		return (
			<Form.Item
				name={title.split(" ").join("").toLowerCase()}
				key={type}
				label={title}
				tooltip={{
					title: description,
					icon: (
						<Space size={4}>
							<span />
							<InfoCircleOutlined />
						</Space>
					),
				}}
				rules={[
					{
						required: required,
						type: inputType,
						message: `The ${title} is not a valid ${inputType}!`,
					},
				]}
			>
				{airbyte_secret ? (
					<Input.Password
						style={{
							height: 50,
						}}
						type="password"
					/>
				) : (
					<Input
						style={{
							height: 50,
						}}
					/>
				)}
			</Form.Item>
		);
	};

	return (
		<>
			{isLoading && (
				<>
					<Spin tip="Please wait..." />
				</>
			)}

			{!isLoading && connectorSpec && (
				<div
					style={{
						textAlign: "left",
						width: "100%",
						borderRadius: 10,
						padding: 10,
					}}
				>
					<Title
						title={connectorTitle}
						editable={{
							onChange: setConnectorTitle,
						}}
						level={4}
					/>
					<Form
						layout="vertical"
						onFinish={checkSpec}
						requiredMark={false}
					>
						{connectorSpec.map((spec) => {
							return getInputCpn(spec);
						})}
						<Form.Item
							style={{
								display: "flex",
								justifyContent: "flex-end",
								marginTop: 20,
							}}
						>
							<CustomButton
								title={"prev"}
								onClick={prev}
								size="large"
								disabled={false}
							/>
							<CustomButton
								loading={checking}
								disabled={checking}
								htmlType="submit"
								title={buttons.CREATE_BUTTON}
								size="large"
								style={{
									marginLeft: 20,
								}}
							/>
						</Form.Item>
					</Form>
				</div>
			)}
		</>
	);
};

export default SpecCpn;
