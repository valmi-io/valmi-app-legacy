/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import randomWords from "random-words";

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

export const getRandomWord = (prefix) => {
	const options = {
		exactly: 1, // generate exactly one word
		maxLength: 10, // maximum length of the word
		formatter: (word) => `${prefix} ${word}`, // add "Source" prefix to the word
		//filter: "adjectives", // filter words related to technology
	};

	return randomWords(options)[0]; // generate a random word with "Source" prefix
};
