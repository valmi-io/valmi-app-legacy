import React, { useEffect } from "react";
import Head from "next/head";

import { useDispatch } from "react-redux";
import cookie from "react-cookies";

import { useAsync } from "react-use";

import NProgress from "nprogress";
import { useRouter } from "next/router";

import MainLayout from "src/components/Layout/MainLayout";
import Loading from "src/components/Loading";

import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "react-redux";

import AuthStorage from "src/utils/auth-storage";
import { resetStore, wrapper } from "src/store/store";
import { Modal } from "antd";
import {
	useLazyFetchWorkSpacesQuery,
	useLazyLogoutUserQuery,
} from "src/store/api/apiSlice";

require("src/styles/index.less");

const urlsIgnore = [
	"/forgot-password",
	"/login-first",
	"/login",
	"/signup",
	"/activate/[uid]/[tid]",
	"/verify-email",
	"/reset-password",
];

const MyApp = (props) => {
	const { Component, pageProps } = props;
	const router = useRouter();
	const store = useStore();

	const dispatch = useDispatch();

	const Layout = Component.getLayout || MainLayout;

	const [fetchWorkSpaces, { data: spaces, isLoading, isError, error }] =
		useLazyFetchWorkSpacesQuery();
	const [logoutUser, { data: logoutData, isError: logoutError }] =
		useLazyLogoutUserQuery();

	useEffect(() => {
		const handleRouteChange = (url, { shallow }) => {
			if (!shallow) {
				NProgress.start();
			}
		};

		router.events.on("routeChangeStart", handleRouteChange);
		router.events.on("routeChangeComplete", () => NProgress.done());
		router.events.on("routeChangeError", () => NProgress.done());

		// If the component is unmounted, unsubscribe
		// from the event with the `off` method:
		return () => {
			router.events.off("routeChangeStart", handleRouteChange);
			router.events.off("routeChangeComplete", () => NProgress.done());
			router.events.off("routeChangeError", () => NProgress.done());
		};
	}, []);

	useAsync(async () => {
		if (AuthStorage.loggedIn) {
			fetchWorkSpaces();
		}
	}, [AuthStorage.loggedIn]);

	useAsync(async () => {
		if (
			!AuthStorage.loggedIn &&
			typeof window !== "undefined" &&
			!urlsIgnore.includes(router.pathname)
		) {
			router.push("/login");
		}
	}, [router.pathname]);

	useEffect(() => {
		if (spaces) {
			console.log("_app.js:- spaces:-", spaces);
		}
	}, [spaces]);

	useEffect(() => {
		if (logoutData === null) {
			AuthStorage.destroy();
			dispatch(resetStore());
			router.push("/login");
		}
	}, [logoutData]);

	let content;

	const handleOk = () => {
		console.log("logout user:_");
		AuthStorage.destroy();
		dispatch(resetStore());
		router.push("/login");
		//logoutUser();
	};

	const handleCancel = () => {};

	if (isLoading) {
		return <Loading fullScreen loading={true} />;
	}

	if (isError) {
		content = (
			<Modal open={true} onOk={handleOk} onCancel={handleCancel}>
				<p>{"Internal server error! Please try again"}</p>
			</Modal>
		);
	}

	return (
		<PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
			<Layout>
				<Head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, shrink-to-fit=no, height=device-height, user-scalable=0"
					/>
				</Head>
				<Component {...pageProps} router={router} />
				{content}
			</Layout>
		</PersistGate>
	);
};

MyApp.getInitialProps = async (context) => {
	const { ctx, Component } = context;
	if (typeof window === "undefined") {
		cookie.plugToRequest(ctx.req, ctx.res);
	}
	if (!AuthStorage.loggedIn && !urlsIgnore.includes(ctx.pathname)) {
		if (ctx.res) {
			ctx.res.writeHead(302, { Location: "/login" });
			ctx.res.end();
		}
	}
	if (AuthStorage.loggedIn && urlsIgnore.includes(ctx.pathname)) {
		if (ctx.res) {
			ctx.res.writeHead(302, { Location: "/" });
			ctx.res.end();
		}
	}
	// calls page's `getInitialProps` and fills `appProps.pageProps`
	let pageProps = {};
	if (Component?.getInitialProps) {
		pageProps = await Component?.getInitialProps(ctx);
	}
	const propsData = {
		...pageProps,
	};
	let layoutProps = {};
	if (Component?.Layout) {
		layoutProps = await Component?.Layout?.getInitialProps?.({
			...ctx,
			pageProps: propsData,
		});
	} else {
		layoutProps = await MainLayout?.getInitialProps?.({
			...ctx,
			pageProps: propsData,
		});
	}
	return {
		pageProps: {
			...propsData,
			...layoutProps,
		},
	};
};

//export default wrapperStore.withRedux(MyApp);
export default wrapper.withRedux(MyApp);
