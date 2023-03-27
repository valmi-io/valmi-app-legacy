/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Router from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Layout, BackTop } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import Sidebar from "src/components/Layout/Sidebar";
import Header from "src/components/Layout/Header";
import Footer from "src/components/Layout/Footer";
import AvatarDropDown from "src/components/AvatarDropDown";

import classes from "./style.module.less";

const { Content, Sider } = Layout;

const propTypes = {
	children: PropTypes.any,
};

const defaultProps = {
	children: null,
};

const MainLayout = (props) => {
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};
	const { children } = props;

	const [collapsed, setCollapsed] = useState(false);
	const [mobiShow, setMobiShow] = useState(false);
	const [broken, setBroken] = useState(false);

	useEffect(() => {
		const handleRouteChange = (url) => {
			setMobiShow(false);
		};

		Router.events.on("routeChangeStart", handleRouteChange);
		return () => {
			Router.events.off("routeChangeStart", handleRouteChange);
		};
	}, []);

	const handleToggle = () => {
		if (broken) {
			setMobiShow(!mobiShow);
		} else {
			setCollapsed(!collapsed);
		}
	};

	return (
		<>
			<Layout
				style={{
					minHeight: "100vh",
				}}
				className={classes.root}
			>
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed && !broken}
					className={classes.sidebar}
					breakpoint="lg"
					onBreakpoint={(val) => {
						setBroken(val);
						if (val) {
							setCollapsed(false);
							setMobiShow(false);
						}
					}}
					style={{
						left: broken && !mobiShow ? -200 : 0,
					}}
				>
					<div
						className={classes.logo}
						style={{
							cursor: "pointer",
						}}
						onClick={() => {
							Router.push(`/spaces/${workspaceId}/syncs`);
						}}
					>
						<Image
							src="/images/valmi_logo_no_text.svg"
							alt="Logo"
							width={28}
							height={28}
						/>
						{!collapsed && (
							<Image
								src="/images/valmi_logo_text.svg"
								alt="Logo"
								width={106}
								height={24}
							/>
						)}
					</div>
					<Sidebar />
				</Sider>
				<Layout
					className={classes.siteLayout}
					style={{
						paddingLeft: broken ? 0 : collapsed ? 50 : 200,
					}}
				>
					<Header
						style={{
							left: broken ? 0 : collapsed ? 50 : 200,
						}}
					>
						{React.createElement(
							collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
							{
								className: classes.trigger,
								onClick: handleToggle,
							}
						)}
						{broken && (
							<Link href="/">
								<div className={classes.logoCenter}>
									<Image
										src="/images/valmi_logo.svg"
										alt="Logo"
										width={128}
										height={28}
									/>
								</div>
							</Link>
						)}
						<div className={classes.headerRight}>
							<AvatarDropDown />
						</div>
					</Header>
					{mobiShow && broken && (
						<div
							className={classes.overlay}
							onClick={() => setMobiShow(false)}
						/>
					)}
					<Content className="mt-1 d-flex">{children}</Content>
					{/* <Footer /> */}
				</Layout>
			</Layout>
			<BackTop />
		</>
	);
};

MainLayout.propTypes = propTypes;
MainLayout.defaultProps = defaultProps;

export default MainLayout;
