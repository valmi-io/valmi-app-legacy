/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { Progress, Select } from "antd";
import PropTypes from "prop-types";

const DropdownCpn = (props) => {
	const {
		onItemSelected,
		connections,
		loading = false,
		style,
		defaultValue = "...",
	} = props;
	const options = [];

	for (let i = 0; i < connections?.length; i++) {
		const connectorName = connections[i].name;
		if (!connectorName) {
			options.push({
				value: i,
				label: connections[i],
				connections: connections[i],
			});
		} else {
			options.push({
				value: i,
				label: connectorName === "string" ? "CONNECTOR" : connectorName,
				connections: connections[i],
			});
		}
	}

	const handleChange = (index, data) => {
		console.log("Selected value handle change:_", data);
		onItemSelected(data);
	};

	return (
		<Select
			defaultValue={defaultValue}
			onChange={handleChange}
			style={{
				...style,
			}}
			className="w-100"
			options={options}
			loading={loading}
		/>
	);
};

const propTypes = {
	connections: PropTypes.array,
};

const defaultProps = {
	connections: [],
};

DropdownCpn.propTypes = propTypes;

DropdownCpn.defaultProps = defaultProps;

export default DropdownCpn;
