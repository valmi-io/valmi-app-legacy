/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import dockerNames from "docker-names";

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

export const getRandomWord = () => {
	return dockerNames.getRandomName();
};
