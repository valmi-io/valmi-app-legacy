/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Sunday, March 19th 2023, 3:55:06 pm
 * Author: Nagendra S @ valmi.io
 */

import React from "react";
import PropTypes from "prop-types";

import { Layout } from "antd";

import classes from "./style.module.less";

const propTypes = {
	children: PropTypes.node,
	style: PropTypes.object,
};

const defaultProps = {
	children: null,
	style: {},
};

const Header = (props) => {
	const { children, style } = props;

	return (
		<div className={classes.headerWrapper}>
			<Layout.Header className={classes.header} style={style}>
				{children}
			</Layout.Header>
		</div>
	);
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
