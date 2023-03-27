/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthLayout from "src/components/Layout/AuthLayout";
import appConstants from "src/constants/app";
import ConfirmActivationCpn from "src/containers/Auth/Confirmation/ConfirmActivationCpn";
import { useLazyActivateUserQuery } from "src/store/api/apiSlice";

const ActivatePage = () => {
	const router = useRouter();
	const { uid, tid } = router.query;
	const [activateUser, { data, isLoading, isError }] =
		useLazyActivateUserQuery();
	const [cardTitle, setCardTitle] = useState("");
	const [cardDescription, setCardDescription] = useState("");
	const [enableLogin, setEnableLogin] = useState(false);

	useEffect(() => {
		activateUser({
			uid,
			token: tid,
		});
	}, []);

	useEffect(() => {
		if (data === null) {
			setCardTitle(appConstants.VALID_TOKEN_DESC_HEADER);
			setCardDescription(appConstants.VALID_TOKEN_DESC_TEXT);
			setEnableLogin(true);
		}
	}, [data]);

	useEffect(() => {
		if (isError) {
			setCardTitle(appConstants.INVALID_TOKEN_DESC_HEADER);
			setCardDescription(appConstants.INVALID_TOKEN_DESC_TEXT);
		}
	}, [isError]);

	const navigateToLogin = () => {
		if (isError) {
			router.push("/signup");
		} else {
			router.push("/login");
		}
	};

	return (
		<ConfirmActivationCpn
			cardTitle={cardTitle}
			cardDescription={cardDescription}
			enableLogin={enableLogin}
			isLoading={isLoading}
			onClick={navigateToLogin}
			status={isError ? "error" : "success"}
		/>
	);
};

ActivatePage.getLayout = ({ children }) => {
	return <AuthLayout>{children}</AuthLayout>;
};

export default ActivatePage;
