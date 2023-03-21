import React from "react";

import Head from "src/components/Head";
import AuthLayout from "src/components/Layout/AuthLayout";

import ForgotPassword from "src/containers/Auth/ForgotPassword/";

const ForgotPasswordPage = (props) => {
	return (
		<>
			<Head title="Forgot Password" />
			<ForgotPassword />
		</>
	);
};

ForgotPasswordPage.getLayout = ({ children }) => {
	return <AuthLayout>{children}</AuthLayout>;
};
export default ForgotPasswordPage;
