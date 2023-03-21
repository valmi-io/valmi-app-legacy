import { Modal, notification } from "antd";

const ErrorCpn = ({ status, msg, description }) => {
	console.log("Error cpn: status_", status);
	// return notification.error({
	// 	message: msg,
	// 	description,
	// });
	// return Modal.error({
	// 	title: "This is an error message",
	// 	content: "some messages...some messages...",
	// });
	Modal.error({
		title: "This is an error message",
		content: "some messages...some messages...",
	});
};

export default ErrorCpn;
