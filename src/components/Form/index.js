/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";

import buttons from "src/constants/buttons";
import CustomButton from "../Button/Button";
import classes from "./style.module.less";

const inputIcon = (type) => {
	const styles = "site-form-item-icon";
	switch (type) {
		case "string":
			return <UserOutlined className={styles} />;
		case "email":
			return <UserOutlined className={styles} />;
		case "password":
			return <LockOutlined className={styles} />;
		default:
			return null;
	}
};

const FormCpn = (props) => {
	const { onFinish, items, button, fetching, buttonTitle, forgotPassword } =
		props;
	return (
		<Form layout="vertical" onFinish={onFinish} requiredMark={false}>
			{items.map((input, index) => {
				return (
					<Form.Item
						name={input.label}
						key={input.type}
						label={input.label}
						rules={[
							{
								required: input.required,
								type: input.type,
								// message: `The ${input.label} is not a valid ${input.type}`,
								message: input.message,
							},
						]}
					>
						{input.type === "password" ? (
							<Input.Password
								className={classes.input}
								prefix={input.prefix && inputIcon(input.type)}
								placeholder={input.label}
							/>
						) : (
							<Input
								className={classes.input}
								prefix={input.prefix && inputIcon(input.type)}
								placeholder={input.label}
							/>
						)}
					</Form.Item>
				);
			})}
			{forgotPassword && (
				<Form.Item>
					<div
						style={{
							textAlign: "right",
						}}
					>
						<Link href="/forgot-password">
							{buttons.FORGOT_PWD_BUTTON}
						</Link>
					</div>
				</Form.Item>
			)}
			{button && (
				<CustomButton
					block={true}
					htmlType="submit"
					size="large"
					loading={fetching}
					title={buttonTitle}
				/>
			)}
		</Form>
	);
};

const propTypes = {
	onFinish: PropTypes.func,
	items: PropTypes.array.isRequired,
	buttonTitle: PropTypes.string.isRequired,
	button: PropTypes.bool.isRequired,
	fetching: PropTypes.bool,
	forgotPassword: PropTypes.bool,
};

const defaultProps = {
	items: [],
	buttonTitle: buttons.OKAY_BUTTON,
	button: true,
	fetching: false,
	forgotPassword: false,
};

FormCpn.propTypes = propTypes;

FormCpn.defaultProps = defaultProps;

export default FormCpn;
