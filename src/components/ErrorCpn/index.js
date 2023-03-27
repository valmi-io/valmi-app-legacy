/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */
import { notification } from "antd";
import errorConstants from "../../constants/errors";

const ErrorCpn = (error, title) => {
	console.log("props;_", error);
	let errorMsg = "";

	const errors = error.data || {};
	const errorFields = Object.keys(errors);

	console.log("error fields:_", errorFields);

	if (errorFields.length > 0) {
		errorMsg = errors[errorFields[0]];
	} else {
		if (error.status === errorConstants.ERROR_FETCH_CODE) {
			errorMsg = errorConstants.ERROR_FETCH;
		}
	}

	notification.error({
		message: title,
		description: errorMsg,
	});
};

export default ErrorCpn;
