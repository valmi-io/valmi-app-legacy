import { Card } from "antd";

const CardCpn = (props) => {
	const {
		children,
		containerStyles,
		style,
		loading = false,
		title = "",
	} = props;
	return (
		<Card
			style={{
				...containerStyles,
				...style,
			}}
			loading={loading}
			title={title}
		>
			{children}
		</Card>
	);
};

export default CardCpn;
