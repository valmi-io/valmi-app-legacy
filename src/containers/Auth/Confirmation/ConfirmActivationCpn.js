/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, March 25th 2023, 6:08:51 pm
 * Author: Nagendra S @ valmi.io
 */
import { Result } from "antd";
import CustomButton from "src/components/Button/Button";
import buttons from "src/constants/buttons";
import AuthContainer from "../AuthContainer";

const ConfirmActivationCpn = ({
	isLoading,
	cardTitle,
	cardDescription,
	enableLogin,
	onClick,
	status = "success",
}) => {
	return (
		<AuthContainer
			style={{
				width: 650,
			}}
			loading={isLoading}
		>
			<Result
				status={status}
				title={cardTitle}
				subTitle={cardDescription}
				extra={
					<CustomButton
						title={
							enableLogin
								? buttons.ACTIVATE_LOGIN_BUTTON
								: buttons.ACTIVATE_SIGNUP_BUTTON
						}
						onClick={onClick}
						size="large"
						block
						disabled={false}
						style={{
							marginTop: 20,
						}}
					/>
				}
			/>
		</AuthContainer>
	);
};

export default ConfirmActivationCpn;
