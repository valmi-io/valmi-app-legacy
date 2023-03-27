import React, { useState } from "react";
import { Modal } from "antd";

const ErrorDialog = ({ error, onClose }) => {
	const [visible, setVisible] = useState(true);

	const handleClose = () => {
		setVisible(false);
		onClose();
	};

	return (
		<Modal
			title="Error"
			open={visible}
			onCancel={handleClose}
			footer={null}
		>
			<p>{error}</p>
		</Modal>
	);
};

export default ErrorDialog;
