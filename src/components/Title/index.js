import { Typography } from "antd";

const Title = ({ style, level, title, editable = false }) => {
	return (
		<Typography.Title
			level={level}
			editable={editable}
			className="font-poppins"
			style={style}
		>
			{title}
		</Typography.Title>
	);
};

export default Title;
