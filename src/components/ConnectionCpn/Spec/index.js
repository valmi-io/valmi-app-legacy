/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

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
import Link from "next/link";
import buttons from "src/constants/buttons";
import {
	useLazyCheckAndAddConnectorSpecQuery,
	useLazyFetchConnectorSpecQuery,
} from "src/store/api/apiSlice";
import { capitalizeFirstLetter, getRandomWord } from "src/utils/lib";
import CustomButton from "../../Button/Button";
import DropdownCpn from "../../Dropdown";
import classes from "./style.module.less";
import { setSelectedConnector, setSpec } from "src/store/reducers/app";
import { useDispatch, useSelector } from "react-redux";
import { generate_config_from_spec } from "./config_generator";

const SpecCpn = (props) => {
	function processConnectorSpec(data) {
		//Ignore oauth2.0 root object
		if (data.spec.authSpecification?.oauth2Specification) {
			const {
				spec: {
					authProvider,
					authSpecification: {
						oauth2Specification: { rootObject },
					},
				},
			} = data;
			setOauthRootObject(rootObject[0]);
			if (authProvider) {
				setAuthProvider(capitalizeFirstLetter(authProvider));
			}
		}

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

		//console.log("Spec arr:-", specArr);
		setConnectorSpec(specArr);

		setConnectorTitle(title);
	}

	const router = useRouter();
	const dispatch = useDispatch();
	const app = useSelector((state) => state.app);

	const { connectorMeta, workspaceId, prev, from_oauth } = props;

	const [connectorSpec, setConnectorSpec] = useState([]);
	const [connectorTitle, setConnectorTitle] = useState("");
	const [otherFormValues, setOtherFormValues] = useState({});
	const [authProvider, setAuthProvider] = useState(null);
	const [oauthButton, showOAuthButton] = useState(false);
	const [oauthRootObject, setOauthRootObject] = useState(null);

	const [oauthValues, setOauthValues] = useState(null);
	const [fetchConnectorSpec, { data, isLoading }] =
		useLazyFetchConnectorSpecQuery();

	const [
		checkConnectorSpec,
		{ data: specData, isLoading: checking, isError, error },
	] = useLazyCheckAndAddConnectorSpecQuery();

	useEffect(() => {
		if (!from_oauth) {
			fetchConnectorSpec({
				type: connectorMeta.type,
				workspaceId: workspaceId,
			});
		} else {
			setOauthValues(app.query);
			processConnectorSpec(app.spec);
		}
	}, []);

	useEffect(() => {
		if (data) {
			console.log("Spec data:_", data);

			// saving state
			dispatch(setSelectedConnector(connectorMeta));
			dispatch(setSpec(data));
			processConnectorSpec(data);
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
		/*if (connectorMeta.type === "DEST_WEBHOOK") {
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
		}*/
		let combinedValues = { ...values, ...otherFormValues, ...oauthValues };
		let config = generate_config_from_spec(app.spec, combinedValues);

		checkConnectorSpec({
			type: connectorMeta.type,
			workspaceId: workspaceId,
			config: { config: config },
			name: getRandomWord(),
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
		// spec type - headers are ignored.
		if (type === "headers") return null;
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
							// 	console.log("On item selected", val);
							otherFormValues[type] = val.label;
							setOtherFormValues(otherFormValues);
						}}
						connections={value.enum}
					/>
				</Form.Item>
			);
		}
		if (inputType === "integer") {
			return (
				<Form.Item
					name={type}
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
				name={type}
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
					<Input.Password className={classes.input} />
				) : (
					<Input className={classes.input} />
				)}
			</Form.Item>
		);
	};

	if (isLoading) {
		return (
			<div className="d-flex justify-content-center">
				<Spin tip="Please wait..." />;
			</div>
		);
	}

	let oauthComponent = () => {
		if (oauthRootObject) {
			if (from_oauth) {
				return (
					<div className="d-flex justify-content-center">
						<Spin tip="Creating connection..." />;
					</div>
				);
			} else {
				return (
					<div className="w-100 justify-content-center">
						<Link
							href="/api/login?url=/spaces/30224d7c-a795-452a-910e-6c280b410373/syncs"
							passHref
						>
							<CustomButton
								title={`Sign in with ${authProvider}`}
								onClick={() => {}}
								size="small"
								disabled={false}
							/>
						</Link>
					</div>
				);
			}
		} else {
			return null;
		}
	};

	return (
		<div className="d-flex ">
			{connectorSpec && (
				<>
					{oauthComponent()}

					<div className="text-left w-100">
						<Form
							layout="vertical"
							onFinish={checkSpec}
							requiredMark={false}
						>
							{connectorSpec.map((spec) => {
								if (spec.type !== oauthRootObject) {
									return getInputCpn(spec);
								}
							})}
							<Form.Item className="d-flex mt-3 justify-content-end">
								<CustomButton
									title={"Back"}
									onClick={prev}
									size="small"
									type="text"
									disabled={checking}
									className={`mr-3 ${
										checking
											? "color-disabled"
											: "color-primary"
									}`}
								/>
								<CustomButton
									loading={checking}
									disabled={checking}
									htmlType="submit"
									title={buttons.CREATE_CONNECTION_BUTTON}
									size="small"
									style={{
										marginLeft: 20,
									}}
								/>
							</Form.Item>
						</Form>
					</div>
				</>
			)}
		</div>
	);
};

export default SpecCpn;
