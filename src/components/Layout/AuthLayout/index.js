import React from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";

const propTypes = {
	children: PropTypes.any,
};

const defaultProps = {
	children: null,
};

const AuthLayout = (props) => {
	const { children } = props;
	return (
		<>
			<Layout
				style={{
					minHeight: "100vh",
					backgroundColor: "#F5F2EB",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{children}
			</Layout>
		</>
	);
};

AuthLayout.propTypes = propTypes;
AuthLayout.defaultProps = defaultProps;

export default AuthLayout;
