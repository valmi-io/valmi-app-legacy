/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

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
			<Layout className="min-vh-100 align-items-center justify-content-center bg-light">
				{children}
			</Layout>
		</>
	);
};

AuthLayout.propTypes = propTypes;
AuthLayout.defaultProps = defaultProps;

export default AuthLayout;
