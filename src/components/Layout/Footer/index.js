import AuthStorage from "src/utils/auth-storage";
import classes from "./style.module.less";

const Footer = (props) => {
	const token = AuthStorage.token || "";
	console.log("token:_", token);
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
