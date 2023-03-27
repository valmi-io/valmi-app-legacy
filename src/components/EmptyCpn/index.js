/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../Button/Button";
import { Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const EmptyCpn = (props) => {
	const { title, btnTitle, onClick, icon } = props;
	return (
		<Result
			icon={icon}
			title={title}
			extra={
				<div className="d-flex justify-content-center">
					<CustomButton
						title={btnTitle}
						onClick={onClick}
						size="large"
					/>
				</div>
			}
		/>
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
