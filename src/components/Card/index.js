/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { Card } from "antd";

const CardCpn = (props) => {
	const {
		children,
		containerStyles,
		loading = false,
		title = "",
		classname = "",
	} = props;
	return (
		<Card
			style={{
				width: "100%",
				borderRadius: 10,
				...containerStyles,
			}}
			loading={loading}
			title={title}
		>
			{children}
		</Card>
	);
};

export default CardCpn;
