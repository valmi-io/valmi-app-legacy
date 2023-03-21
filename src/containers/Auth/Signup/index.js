import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Router from "next/router";
import Link from "next/link";

import AuthStorage from "src/utils/auth-storage";
import buttons from "src/constants/buttons";
import { resetStore } from "src/store/store";
import FormCpn from "src/components/Form";
import AuthContainer from "../AuthContainer";
import appConstants from "src/constants/app";
import { useLazySignupUserQuery } from "src/store/api/apiSlice";
import { notification } from "antd";
import LinkConfirmation from "../Login/LinkConfirmation";

const Signup = (props) => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [emailSentDialog, showEmailSentDialog] = useState(false);
	const [signupUser, { data, isLoading, isError, error }] =
		useLazySignupUserQuery();

	useEffect(() => {
		if (AuthStorage.loggedIn) {
			Router.push("/");
		} else {
			dispatch(resetStore());
		}
	}, []);

	useEffect(() => {
		if (data) {
			console.log("sign up data:_", data);
			showEmailSentDialog(true);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			console.log("Errors while signing up:_", error);
			const errors = error.data;
			let errorDescription = "";
			Object.entries(errors).forEach(function ([key, value]) {
				if (key === "email") {
					errorDescription = value;
					return;
				}
				if (key === "username") {
					errorDescription = value;
					return;
				}
			});
			notification.error({
				message: errors.SIGN_UP_FAILED,
				description: errorDescription,
			});
		}
	}, [isError]);

	const checkSignupCredentials = async (values) => {
		const { Username, Email, Password } = values;
		setEmail(Email);
		const payload = {
			username: Username,
			email: Email,
			password: Password,
		};

		signupUser(payload);
	};

	const inputs = [
		{
			label: "Username",
			required: true,
			type: "string",
			message: "Please input your name",
			prefix: true,
		},
		{
			label: "Email",
			required: true,
			type: "email",
			message: "Please input your email",
			prefix: true,
		},
		{
			label: "Password",
			required: true,
			type: "password",
			message: "Please input your password",
			prefix: true,
		},
	];

	if (emailSentDialog) {
		return (
			<>
				<AuthContainer style={{ width: 650 }}>
					<LinkConfirmation title={appConstants.EMAIL_SENT_HEADER}>
						<p>
							{appConstants.EMAIL_SENT_DESC_HEADER}{" "}
							<strong>{email}</strong>{" "}
							{appConstants.TO_CONTINUE_TEXT}
						</p>
						<p>{appConstants.PRIVACY_POLICY_TEXT}</p>
					</LinkConfirmation>
				</AuthContainer>
			</>
		);
	}

	return (
		<>
			<AuthContainer>
				<>
					<FormCpn
						onFinish={checkSignupCredentials}
						items={inputs}
						button={true}
						fetching={isLoading}
						buttonTitle={buttons.SIGNUP_BUTTON}
						forgotPassword={false}
					/>
					<div
						style={{
							marginTop: 20,
							alignItems: "center",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<p>
							{appConstants.HAS_ACCOUNT}
							<Link href="/login">{buttons.LOGIN_BUTTON}</Link>
						</p>
					</div>
				</>
			</AuthContainer>
		</>
	);
};

export default Signup;
