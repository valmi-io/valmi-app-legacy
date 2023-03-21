import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../Button/Button";
import { Empty } from "antd";

const EmptyCpn = (props) => {
	const { title, btnTitle, onClick } = props;
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				marginTop: 50,
			}}
		>
			<Empty description={title} />
			<CustomButton title={btnTitle} onClick={onClick} size="large" />
		</div>
	);
};

const propTypes = {
	title: PropTypes.string,
	btnTitle: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
};

const defaultProps = {
	title: "",
	btnTitle: "Create",
	className: "",
	style: {},
};

EmptyCpn.propTypes = propTypes;

EmptyCpn.defaultProps = defaultProps;

export default EmptyCpn;
