import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import { notification } from "antd";

import AuthStorage from "src/utils/auth-storage";
import buttons from "src/constants/buttons";
import { resetStore } from "src/store/store";
import { useLazyLoginAndFetchWorkSpacesQuery } from "src/store/api/apiSlice";
import { setUserData, setWorkspaceId } from "src/store/reducers/user";
import errors from "src/constants/errors";
import FormCpn from "src/components/Form";
import AuthContainer from "../AuthContainer";
import appConstants from "src/constants/app";
import ErrorCpn from "src/components/ErrorCpn";

const Login = (props) => {
	const dispatch = useDispatch();
	const [loginAndFetchWorkSpaces, { data, isLoading, isError, error }] =
		useLazyLoginAndFetchWorkSpacesQuery();

	useEffect(() => {
		if (AuthStorage.loggedIn) {
			Router.push("/");
		} else {
			dispatch(resetStore());
		}
	}, []);

	useEffect(() => {
		if (data) {
			dispatch(setUserData(data));
			const workspaceID = data.organizations[0].workspaces[0].id;
			//const workspaceName = data.organizations[0].workspaces[0].name;
			dispatch(setWorkspaceId(workspaceID));
			Router.push(`/spaces/${workspaceID}/syncs`);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			console.log("error.data", error);
			let errorMsg = errors.ERROR_500;
			if (error.originalStatus !== 500) {
				errorMsg = error.data.non_field_errors[0];
			}
			notification.error({
				message: errors.SIGN_IN_FAILED,
				description: errorMsg,
			});
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
			<AuthContainer>
				<FormCpn
					onFinish={checkLoginCredentials}
					items={formInputs}
					button={true}
					fetching={isLoading}
					buttonTitle={buttons.LOGIN_BUTTON}
					// forgotPassword={true}
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
						{appConstants.HAS_NOT_ACCOUNT}
						<Link href="/signup">{buttons.SIGNUP_BUTTON}</Link>
					</p>
				</div>
			</AuthContainer>
		</>
	);
};

export default Login;
