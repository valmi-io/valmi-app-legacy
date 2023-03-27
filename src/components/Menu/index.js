/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import React from "react";
import PropTypes from "prop-types";
import { Menu } from "antd";

const propTypes = {
	theme: PropTypes.oneOf(["dark", "light"]),
	onClick: PropTypes.func,
	items: PropTypes.array.isRequired,
	defaultSelectedKeys: PropTypes.array,
	className: PropTypes.string,
	style: PropTypes.object,
};

const defaultProps = {
	theme: "dark",
	className: "",
	style: {
		padding: "15px 0",
	},
	items: [],
	defaultSelectedKeys: [],
};

const MenuCpn = (props) => {
	const { theme, onClick, items, defaultSelectedKeys, style } = props;
	return (
		<Menu
			theme={theme}
			selectedKeys={defaultSelectedKeys}
			mode="inline"
			items={items}
			onClick={onClick}
			style={style}
		/>
	);
};

MenuCpn.propTypes = propTypes;

MenuCpn.defaultProps = defaultProps;

export default MenuCpn;
