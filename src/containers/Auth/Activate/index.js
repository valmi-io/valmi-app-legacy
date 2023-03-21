import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomButton from "src/components/Button/Button";
import appConstants from "src/constants/app";
import buttons from "src/constants/buttons";
import { useLazyActivateUserQuery } from "src/store/api/apiSlice";
import AuthContainer from "../AuthContainer";
import LinkConfirmation from "../Login/LinkConfirmation";

const Activate = (props) => {
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

	return (
		<AuthContainer
			style={{
				width: 650,
			}}
			loading={isLoading}
		>
			<LinkConfirmation title={cardTitle}>
				<p style={{ textAlign: "center" }}>{cardDescription}</p>
			</LinkConfirmation>
			{enableLogin && (
				<CustomButton
					title={buttons.ACTIVATE_LOGIN_BUTTON}
					onClick={() => router.push("/login")}
					size="large"
					block
					disabled={false}
					style={{
						marginTop: 20,
					}}
				/>
			)}
		</AuthContainer>
	);
};

export default Activate;
