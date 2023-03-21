import React from "react";
import Head from "src/components/Head";
import Syncs from "src/containers/Syncs/Syncs";
const propTypes = {};

const defaultProps = {};

const SyncsPage = (props) => {
	return (
		<>
			<Head title="Syncs" />
			<Syncs />
		</>
	);
};

SyncsPage.propTypes = propTypes;

SyncsPage.defaultProps = defaultProps;

export default SyncsPage;
