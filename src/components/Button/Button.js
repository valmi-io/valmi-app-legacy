import { Button } from "antd";
import PropTypes from "prop-types";

const CustomButton = (props) => {
	const {
		title,
		className,
		style,
		type,
		size,
		htmlType,
		onClick,
		block,
		loading,
		disabled,
	} = props;
	return (
		<Button
			type={type}
			size={size}
			className={className}
			style={style}
			htmlType={htmlType}
			onClick={onClick}
			block={block}
			loading={loading}
			disabled={disabled}
		>
			{title}
		</Button>
	);
};

const propTypes = {
	title: PropTypes.string.isRequired,
	className: PropTypes.string,
	type: PropTypes.oneOf([
		"primary",
		"dashed",
		"text",
		"link",
		"ghost",
		"default",
	]),
	loading: PropTypes.bool,
	block: PropTypes.bool,
	htmlType: PropTypes.string,
	style: PropTypes.object,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};

const defaultProps = {
	title: "",
	className: "",
	style: {
		// backgroundColor: "#f6ca8f",
		// borderColor: "#f6ca8f",
	},
	htmlType: "button",
	type: "primary",
	size: 50,
	block: false,
	loading: false,
	disabled: false,
};

CustomButton.propTypes = propTypes;

CustomButton.defaultProps = defaultProps;

export default CustomButton;
