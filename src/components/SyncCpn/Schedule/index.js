/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, InputNumber, Space } from "antd";

const ConnectionScheduleCpn = (props) => {
	const { syncInterval, setSyncInterval } = props;
	return (
		<Form
			layout="vertical"
			onFinish={() => {
				console.log("on finish:_");
			}}
			requiredMark={false}
		>
			<Form.Item
				name={"Schedule"}
				label={"Schedule"}
				tooltip={{
					title: "sync_interval in minutes",
					icon: (
						<Space size={4}>
							<span />
							<InfoCircleOutlined />
						</Space>
					),
				}}
				style={{
					display: "flex",
				}}
				rules={[
					{
						required: true,
						type: "integer",
						message: `The Schedule is not a valid integer!`,
					},
				]}
			>
				<InputNumber
					value={syncInterval}
					controls={false}
					onChange={setSyncInterval}
					size="large"
					maxLength={4}
					style={{
						height: 50,
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
				/>
			</Form.Item>
		</Form>
	);
};

export default ConnectionScheduleCpn;
