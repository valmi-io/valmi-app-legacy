export const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const connectorTypes = {
	SRC: "SRC",
	DEST: "DEST",
	SOURCE: "Warehouse",
	DESTINATION: "Destination",
};

export const getConnectorSrc = (connectorType) => {
	return `/connectors/${connectorType.toLowerCase()}.svg`;
};
