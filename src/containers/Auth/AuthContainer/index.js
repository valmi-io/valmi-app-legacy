import PropTypes from "prop-types";
import CardCpn from "src/components/Card";

import Logo from "src/components/Layout/Logo";

const AuthContainer = (props) => {
	const { children, containerStyles, style, loading = false } = props;
	return (
		<>
			<CardCpn
				containerStyles={containerStyles}
				style={style}
				loading={loading}
			>
				<div className="text-center mb-5">
					<Logo width={480} height={48} />
				</div>
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
