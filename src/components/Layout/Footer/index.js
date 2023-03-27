/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import AuthStorage from "src/utils/auth-storage";
import classes from "./style.module.less";

const Footer = (props) => {
	const token = AuthStorage.token || "";
	//console.log("token:_", token);
	return (
		<footer className={classes.footer}>
			<div className="ml-auto">
				<span>token: {token} </span>
				{/* <span>Powered by </span>
				<strong className="text-primary">valmi.io</strong> */}
			</div>
		</footer>
	);
};

export default Footer;
