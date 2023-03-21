import React from "react";
import PropTypes from "prop-types";

import Head from "src/components/Head";
import Connection from "src/containers/Connections";

const propTypes = {
	// connections: PropTypes.array,
};

const defaultProps = {
	// connections: [],
};

const ConnectionsPage = (props) => {
	return (
		<>
			<Head title="Connections" />
			<Connection />
		</>
	);
};

ConnectionsPage.propTypes = propTypes;

ConnectionsPage.defaultProps = defaultProps;

export default ConnectionsPage;
