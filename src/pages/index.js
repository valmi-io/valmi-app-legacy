/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import Head from "src/components/Head";

const HomePage = (props) => {
	const router = useRouter();
	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	useEffect(() => {
		router.push(`/spaces/${workspaceId}/syncs`);
	}, []);

	return (
		<>
			<Head />
		</>
	);
};

export default HomePage;
