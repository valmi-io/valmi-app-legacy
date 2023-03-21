import React from "react";
import { useDispatch } from "react-redux";
import useAsync from "react-use/lib/useAsync";

import AuthStorage from "src/utils/auth-storage";
import Link from "next/link";

import Image from "next/image";

import { Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

import classes from "./style.module.less";
import CustomButton from "src/components/Button/Button";
import buttons from "src/constants/buttons";
import AuthContainer from "../AuthContainer";
import FormCpn from "src/components/Form";

const ForgotPassword = (props) => {
	// const { token } = props;

	const dispatch = useDispatch();
	const [loading, setLoading] = React.useState(false);
	const [sent, setSent] = React.useState(false);

	useAsync(async () => {
		if (AuthStorage.loggedIn) {
			await dispatch(await actionLogout());
		}
	}, []);

	const onFinish = async (values) => {
		// try {
		// 	setLoading(true);
		// 	await dispatch(
		// 		await actionForgotPassword({
		// 			...values,
		// 		})
		// 	);
		// 	setSent(true);
		// } finally {
		// 	setLoading(false);
		// }
	};

	if (sent) {
		return (
			<div className={classes.wrapper}>
				<div>
					<div className={classes.leftOverlay} />
					<div className={classes.leftContent}>
						<div className="d-flex justify-content-center align-content-center flex-1 flex-column">
							<div
								style={{
									width: 350,
									margin: "0 auto 40px",
									borderRadius: 4,
									background: "#fff",
									padding: "40px 20px",
									color: "#000",
								}}
							>
								<div className="text-center mb-5">
									<Image
										src="/images/logo.png"
										alt="Logo"
										width={150}
										height={150}
									/>
								</div>

								<p className="text-center mt-3 text-black">
									An email has been sent to your email address
									to reset your password. Please check your
									email and reset your password before logging
									in.
								</p>

								<div className="text-center">
									<Link href="/login">
										<CustomButton
											className="mt-3"
											title={buttons.LOGIN_BUTTON}
											loading={loading}
										/>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const inputs = [
		{
			label: "Email",
			required: true,
			type: "email",
			message: "Please input your email",
			prefix: true,
		},
	];

	return (
		<>
			<AuthContainer>
				<FormCpn
					onFinish={onFinish}
					items={inputs}
					button={true}
					//fetching={isLoading}
					buttonTitle={buttons.RESET_BUTTON}
					forgotPassword={false}
				/>
			</AuthContainer>
		</>
	);

	return (
		<div className={classes.wrapper}>
			<div className={classes.left}>
				<div className={classes.leftOverlay} />
				<div className={classes.leftContent}>
					<div className="d-flex justify-content-center align-content-center flex-1 flex-column">
						<Form
							name="normal_login"
							className="login-form"
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
							style={{
								width: 350,
								margin: "0 auto 40px",
								borderRadius: 4,
								background: "#fff",
								padding: "40px 20px",
							}}
							size="large"
						>
							<div className="text-center mb-5">
								<Image
									src="/images/logo.png"
									alt="Logo"
									width={150}
									height={150}
								/>
							</div>
							<p className="text-center mb-3">
								Enter your email address. We will send you a
								link for you to reset your password.
							</p>

							<Form.Item
								name="email"
								rules={[
									{
										type: "email",
										message:
											"The input is not valid E-mail!",
									},
									{
										required: true,
										message: "Please input your E-mail!",
									},
								]}
							>
								<Input
									prefix={
										<UserOutlined className="site-form-item-icon" />
									}
									placeholder="Email"
								/>
							</Form.Item>
							<CustomButton
								block={true}
								htmlType="submit"
								size="large"
								loading={loading}
								title={buttons.RESET_BUTTON}
							/>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
