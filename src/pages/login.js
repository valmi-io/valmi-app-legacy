/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import ErrorCpn from "src/components/ErrorCpn";
import FormCpn from "src/components/Form";

import Head from "src/components/Head";
import AuthLayout from "src/components/Layout/AuthLayout";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import errors from "src/constants/errors";
import AuthContainer from "src/containers/Auth/AuthContainer";
import { useLazyLoginAndFetchWorkSpacesQuery } from "src/store/api/apiSlice";
import { setUserData, setWorkspaceId } from "src/store/reducers/user";
import { resetStore } from "src/store/store";
import AuthStorage from "src/utils/auth-storage";

const LoginPage = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [loginAndFetchWorkSpaces, { data, isLoading, isError, error }] =
		useLazyLoginAndFetchWorkSpacesQuery();

	useEffect(() => {
		if (AuthStorage.loggedIn) {
			router.push("/");
		} else {
			dispatch(resetStore());
		}
	}, []);

	useEffect(() => {
		if (data) {
			dispatch(setUserData(data));
			const workspaceID = data.organizations[0].workspaces[0].id;
			dispatch(setWorkspaceId(workspaceID));
			router.push(`/spaces/${workspaceID}/syncs`);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			ErrorCpn(error, errors.SIGN_IN_FAILED);
		}
	}, [isError]);

	const checkLoginCredentials = async (values) => {
		const { Email, Password } = values;
		const payload = {
			email: Email,
			password: Password,
		};
		loginAndFetchWorkSpaces(payload);
	};

	const formInputs = [
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
	return (
		<>
			<Head title="Login" />
			<AuthContainer>
				<FormCpn
					onFinish={checkLoginCredentials}
					items={formInputs}
					button={true}
					fetching={isLoading}
					buttonTitle={buttons.LOGIN_BUTTON}
					forgotPassword={false}
				/>
				<div className="d-flex align-items-center justify-content-center mt-3">
					<p>
						{appConstants.HAS_NO_ACCOUNT}
						<Link href="/signup">{buttons.SIGNUP_BUTTON}</Link>
					</p>
				</div>
			</AuthContainer>
		</>
	);
};

LoginPage.getLayout = ({ children }) => {
	return <AuthLayout>{children}</AuthLayout>;
};

export default LoginPage;
