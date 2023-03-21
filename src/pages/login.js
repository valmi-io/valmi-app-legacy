import React from "react";

import Head from "src/components/Head";
import AuthLayout from "src/components/Layout/AuthLayout";
import Login from "src/containers/Auth/Login/";

const LoginPage = (props) => {
	return (
		<>
			<Head title="Login" />
			<Login />
		</>
	);
};

LoginPage.getLayout = ({ children }) => {
	return <AuthLayout>{children}</AuthLayout>;
};

export default LoginPage;
