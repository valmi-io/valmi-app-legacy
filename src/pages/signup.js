import React from "react";

import Head from "src/components/Head";
import AuthLayout from "src/components/Layout/AuthLayout";
import Signup from "src/containers/Auth/Signup";

const SignupPage = (props) => {
	return (
		<>
			<Head title="Signup" />
			<Signup />
		</>
	);
};

SignupPage.getLayout = ({ children }) => {
	return <AuthLayout>{children}</AuthLayout>;
};
export default SignupPage;
