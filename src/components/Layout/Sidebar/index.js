import React from "react";
import { useRouter } from "next/router";
import { DashboardOutlined, AntDesignOutlined } from "@ant-design/icons";

import routes from "src/constants/routes";
import MenuCpn from "src/components/Menu";
import { useSelector } from "react-redux";

const propTypes = {};

const defaultProps = {};

function getItem(label, key, icon, children) {
	return {
		key,
		icon,
		children,
		label,
	};
}

const items = [
	getItem(routes.SYNCS_ROUTE, routes.SYNCS_ROUTE, <DashboardOutlined />),
	getItem(
		routes.CONNECTIONS_ROUTE,
		routes.CONNECTIONS_ROUTE,
		<AntDesignOutlined />
	),
];

const Sidebar = () => {
	const router = useRouter();
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	const [, root, sub, endpoint] = router.pathname?.split("/");

	const onMenuClicked = ({ key }) => {
		const route = key.toLowerCase();
		router.push(`/spaces/${workspaceId}/${route}`);
	};

	return (
		<>
			<MenuCpn
				defaultSelectedKeys={[
					endpoint === routes.SYNCS_ROUTE.toLowerCase()
						? routes.SYNCS_ROUTE
						: routes.CONNECTIONS_ROUTE,
				]}
				items={items}
				onClick={onMenuClicked}
			/>
		</>
	);
};

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
