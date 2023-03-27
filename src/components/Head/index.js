/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";

import METADATA from "src/constants/metadata";

import Meta from "./Meta";

const propTypes = {
	title: PropTypes.string.isRequired,
};

const defaultProps = {
	title: "",
};

const HeadShare = (props) => {
	const { title, ...attr } = props;

	return (
		<Head>
			<title>{(title ? title + " | " : "") + METADATA.APP_NAME}</title>
			{/* <link rel="icon" href="/images/valmi_logo.svg" /> */}
			<Meta {...attr} />
		</Head>
	);
};

HeadShare.propTypes = propTypes;

HeadShare.defaultProps = defaultProps;

export default HeadShare;
