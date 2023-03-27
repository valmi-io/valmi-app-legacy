/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import ErrorCpn from "src/components/ErrorCpn";
import FormCpn from "src/components/Form";
import Head from "src/components/Head";
import AuthLayout from "src/components/Layout/AuthLayout";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import errors from "src/constants/errors";
import AuthContainer from "src/containers/Auth/AuthContainer";
import ConfirmActivationCpn from "src/containers/Auth/Confirmation/ConfirmActivationCpn";
import ConfirmEmailCpn from "src/containers/Auth/Confirmation/ConfirmEmailCpn";
import { useLazySignupUserQuery } from "src/store/api/apiSlice";
import { resetStore } from "src/store/store";
import AuthStorage from "src/utils/auth-storage";

const SignupPage = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [emailSentDialog, showEmailSentDialog] = useState(false);
	const [confirmDialog, showConfirmDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [signupUser, { data, isError, error }] = useLazySignupUserQuery();

	useEffect(() => {
		if (AuthStorage.loggedIn) {
			router.push("/");
		} else {
			dispatch(resetStore());
		}
	}, []);

	useEffect(() => {
		if (data) {
			console.log("Sign up data:_", data);
			const { is_active } = data;
			if (is_active) {
				showConfirmDialog(true);
			} else {
				showEmailSentDialog(true);
			}
			setIsLoading(false);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			console.log("Error:_", error);
			setIsLoading(false);
			ErrorCpn(error, errors.SIGN_UP_FAILED);
		}
	}, [isError]);

	const checkSignupCredentials = async (values) => {
		setIsLoading(true);
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

	const navigateToLogin = () => {
		router.push("/login");
	};

	if (confirmDialog) {
		return (
			<ConfirmActivationCpn
				cardTitle={appConstants.VALID_TOKEN_DESC_HEADER}
				cardDescription={appConstants.VALID_TOKEN_DESC_TEXT}
				enableLogin={true}
				isLoading={false}
				onClick={navigateToLogin}
			/>
		);
	}

	if (emailSentDialog) {
		return <ConfirmEmailCpn email={email} />;
	}

	return (
		<>
			<Head title="Signup" />
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

					<div className="d-flex align-items-center justify-content-center mt-3">
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

SignupPage.getLayout = ({ children }) => {
	return <AuthLayout>{children}</AuthLayout>;
};
export default SignupPage;
