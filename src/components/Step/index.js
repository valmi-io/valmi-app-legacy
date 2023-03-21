import { Steps } from "antd";
import PropTypes from "prop-types";
import CardCpn from "../Card";
import PageLayout from "../Layout/PageLayout";

const StepCpn = (props) => {
	const { steps, current, contentStyle, children } = props;

	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));

	return (
		<PageLayout displayHeader={false}>
			<Steps
				style={{
					width: "100%",
				}}
				size="default"
				current={current}
				items={items}
			/>
			<CardCpn style={contentStyle}>
				{steps[current].content}
				{children}
			</CardCpn>
		</PageLayout>
	);
};

const propTypes = {
	steps: PropTypes.array.isRequired,
	current: PropTypes.number,
	contentStyle: PropTypes.object,
};

const defaultProps = {
	steps: [],
	current: 0,
};

StepCpn.propTypes = propTypes;
StepCpn.defaultProps = defaultProps;

export default StepCpn;
