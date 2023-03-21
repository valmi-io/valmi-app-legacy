import React from "react";
import Head from "src/components/Head";
import SyncDetails from "src/containers/Syncs/Details";

const propTypes = {};

const defaultProps = {};

const SyncStatusPage = (props) => {
	return (
		<>
			<Head title="Sync" />
			<SyncDetails />
		</>
	);
};

SyncStatusPage.propTypes = propTypes;

SyncStatusPage.defaultProps = defaultProps;

export default SyncStatusPage;
