/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import PropTypes from "prop-types";
import CardCpn from "src/components/Card";

import Logo from "src/components/Layout/Logo";

const AuthContainer = (props) => {
	const {
		children,
		containerStyles,
		style,
		loading = false,
		displayLogo = true,
	} = props;
	return (
		<>
			<CardCpn
				containerStyles={{
					...containerStyles,
					...style,
				}}
				loading={loading}
			>
				{displayLogo && (
					<div className="text-center mb-5">
						<Logo width={300} height={50} />
					</div>
				)}
				{children}
			</CardCpn>
		</>
	);
};

const propTypes = {
	containerStyles: PropTypes.object.isRequired,
	style: PropTypes.object,
};

const defaultProps = {
	containerStyles: {
		width: 450,
		padding: 50,
		borderRadius: 20,
		backgroundColor: "#fff",
	},
	style: {},
};

AuthContainer.propTypes = propTypes;

AuthContainer.defaultProps = defaultProps;

export default AuthContainer;
