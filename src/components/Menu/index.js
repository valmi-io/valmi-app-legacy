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
			defaultSelectedKeys={defaultSelectedKeys}
			// selectedKeys={["/" + (sub && sub !== "[id]" ? sub : root)]}
			//selectedKeys={["/" + root + "/" + sub + "/" + endpoint]}
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
