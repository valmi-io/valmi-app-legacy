import React from "react";
import Head from "src/components/Head";
import NewSync from "src/containers/Syncs/NewSync";

const propTypes = {};

const defaultProps = {};

const NewSyncsPage = (props) => {
	return (
		<>
			<Head title="Sync" />
			<NewSync />
		</>
	);
};

NewSyncsPage.propTypes = propTypes;

NewSyncsPage.defaultProps = defaultProps;

export default NewSyncsPage;
