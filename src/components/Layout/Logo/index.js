/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import React from "react";
import Image from "next/image";

const Logo = (props) => {
	const { ...attrs } = props;

	return (
		<Image
			{...attrs}
			src="/images/valmi_logo.svg"
			alt="Logo"
			priority={true}
			loading="eager"
		/>
	);
};

export default Logo;
