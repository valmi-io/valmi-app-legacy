import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import Head from "src/components/Head";

const propTypes = {};

const defaultProps = {};

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

HomePage.propTypes = propTypes;

HomePage.defaultProps = defaultProps;

export default HomePage;
