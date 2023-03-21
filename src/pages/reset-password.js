import React from "react";
import PropTypes from "prop-types";

import Head from "src/components/Head";

import SetPassword from "src/containers/Auth/SetPassword/";

const propTypes = {
	router: PropTypes.object.isRequired,
};

const defaultProps = {
	router: {},
};

const SetPasswordPage = (props) => {
	const { router: { query: { access_token: token } = {} } = {} } = props;

	return (
		<>
			<Head title="Set Password" />
			<SetPassword token={token} />
		</>
	);
};

SetPasswordPage.propTypes = propTypes;

SetPasswordPage.defaultProps = defaultProps;

SetPasswordPage.Layout = ({ children }) => children;

export default SetPasswordPage;
