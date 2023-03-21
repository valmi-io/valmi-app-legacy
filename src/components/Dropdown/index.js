import { Select } from "antd";
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
			size="large"
			defaultValue={defaultValue}
			onChange={handleChange}
			style={{
				width: "100%",
				...style,
			}}
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
