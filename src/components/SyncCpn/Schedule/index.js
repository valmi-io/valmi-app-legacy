import { InputNumber } from "antd";

const ConnectionScheduleCpn = (props) => {
	const { syncInterval, setSyncInterval } = props;
	return (
		<div>
			<div
				style={{
					display: "flex",
					width: "50%",
					alignItems: "center",
				}}
			>
				<span>{"Every"}</span>
				<InputNumber
					controls={false}
					size="large"
					value={syncInterval}
					onChange={setSyncInterval}
					style={{
						height: 50,
						display: "flex",
						alignItems: "center",
						marginLeft: 10,
						marginRight: 10,
					}}
				/>
				<span>{"Minutes"}</span>
			</div>
		</div>
	);
};

export default ConnectionScheduleCpn;
