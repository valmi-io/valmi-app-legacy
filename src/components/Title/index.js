/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { Typography } from "antd";

const Title = ({ style, level, title, editable = false, classnames = {} }) => {
	return (
		<Typography.Title
			level={level}
			editable={editable}
			style={{ margin: 0, fontFamily: "Poppins", ...style }}
			className={`${classnames}`}
		>
			{title}
		</Typography.Title>
	);
};

export default Title;
