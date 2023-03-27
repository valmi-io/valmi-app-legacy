/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, March 25th 2023, 6:08:43 pm
 * Author: Nagendra S @ valmi.io
 */
import { Result } from "antd";
import appConstants from "src/constants/app";
import AuthContainer from "../AuthContainer";

const ConfirmEmailCpn = ({ email }) => {
	return (
		<AuthContainer displayLogo={true} style={{ width: 650 }}>
			<Result
				status="success"
				title={appConstants.EMAIL_SENT_HEADER}
				subTitle={
					appConstants.EMAIL_SENT_DESC_HEADER +
					email +
					". " +
					appConstants.VERIFY_EMAIL_TEXT
				}
			/>
		</AuthContainer>
	);
};

export default ConfirmEmailCpn;
