import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Dropdown, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ExclamationCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import Avatar from "src/components/Avatar";
import classes from "./style.module.less";
import buttons from "src/constants/buttons";
import { resetStore } from "src/store/store";
import appConstants from "src/constants/app";
import { useLazyLogoutUserQuery } from "src/store/api/apiSlice";
import AuthStorage from "src/utils/auth-storage";

const propTypes = {
	style: PropTypes.object,
};

const defaultProps = {
	style: {
		width: "250px",
	},
};

const AvatarDropDown = (props) => {
	const router = useRouter();
	const { style } = props;

	const auth = useSelector((state) => state.auth);
	const user = useSelector((state) => state.user.user);

	const [logoutUser, { data, isError }] = useLazyLogoutUserQuery();

	const { paymentDetail: { paid } = {} } = auth || {};

	const { email = appConstants.DEFAULT_EMAIL } = user || {};

	const dispatch = useDispatch();

	const handleLogout = React.useCallback(async () => {
		Modal.confirm({
			title: "Are you sure?",
			icon: <ExclamationCircleOutlined />,
			onOk: () => {
				logoutUser();
			},
			onCancel() {
				//console.log("Cancel");
			},
		});
	}, [dispatch]);

	useEffect(() => {
		if (data === null) {
			AuthStorage.destroy();
			dispatch(resetStore());
			router.push("/login");
		}
	}, [data]);

	const items = [
		{
			key: "1",
			label: (
				<>
					<div className={classes.name}>
						<Avatar
							size={50}
							// src={user.avatar}
							fullName={email}
							vip={paid}
							style={{
								backgroundColor: "#19bc9b",
							}}
						/>
						<div className={classes.fullName}>
							{/* <strong>{user.email}</strong> */}
							<div className="text-small">{email}</div>
						</div>
					</div>
				</>
			),
		},
		{
			type: "divider",
		},
		{
			key: "3",
			label: (
				<a className={classes.item} onClick={handleLogout}>
					<span>{buttons.LOGOUT_BUTTON}</span>
				</a>
			),
			icon: <LogoutOutlined />,
		},
	];

	return (
		<Dropdown
			menu={{
				items,
			}}
			trigger={["click"]}
			style={style}
		>
			<div style={{ lineHeight: "50px" }}>
				<Avatar
					size={30}
					fullName={email}
					style={{
						cursor: "pointer",
						backgroundColor: "#19bc9b",
					}}
					vip={paid}
				/>
			</div>
		</Dropdown>
	);
};

AvatarDropDown.propTypes = propTypes;
AvatarDropDown.defaultProps = defaultProps;

export default AvatarDropDown;
