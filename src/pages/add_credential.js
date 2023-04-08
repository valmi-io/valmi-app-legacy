/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "src/store/reducers/app";

const OAuthRedirectPage = () => {
	const router = useRouter();
	const dispatch = useDispatch();

	console.log("query:_", router.query);

	const user = useSelector((state) => state.user);
	const app = useSelector((state) => state.app);

	useEffect(() => {
		const { workspaceId = "" } = user || {};
		const { selectedConnector = "" } = app || {};
		dispatch(setQuery(router.query));
		router.push(
			`/spaces/${workspaceId}/connections/new-connection?from_oauth=true&connector_type=${
				selectedConnector.type.split("_")[0]
			}`
		);
	}, []);

	return null;
};

export default OAuthRedirectPage;
