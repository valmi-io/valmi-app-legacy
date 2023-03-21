import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ConnectorCpn from "src/components/ConnectionCpn/Connector";
import PageLayout from "src/components/Layout/PageLayout";
import SpecCpn from "src/components/ConnectionCpn/Spec";
import StepCpn from "src/components/Step";
import appConstants from "src/constants/app";
import CustomButton from "src/components/Button/Button";
import buttons from "src/constants/buttons";

const NewConnection = (props) => {
	const formRef = useRef(null);
	const [currSrcStep, setCurrSrcStep] = useState(0);
	const [connectorMeta, setConnectorMeta] = useState(null);

	const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

	const { type = "SRC" } = props;

	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	useEffect(() => {
		if (!connectorMeta) {
			setIsNextButtonDisabled(true);
		} else {
			setIsNextButtonDisabled(false);
		}
	}, [connectorMeta]);

	const next = () => {
		setIsNextButtonDisabled(true);
		setCurrSrcStep(currSrcStep + 1);
	};

	const prev = () => {
		setIsNextButtonDisabled(true);
		setCurrSrcStep(currSrcStep - 1);
	};

	const handleConnectorSelected = useCallback(
		(connector) => {
			setConnectorMeta(connector);
		},
		[steps]
	);

	const contentStyle = {
		textAlign: "center",
		borderRadius: 10,
		//border: `1px dashed ${"bl"}`,
		marginTop: 16,
	};

	const steps = [
		{
			title:
				type === "SRC"
					? appConstants.SET_SRC_CONNECTOR
					: appConstants.SET_DEST_CONNECTOR,
			content: (
				<ConnectorCpn
					handleConnectorSelected={handleConnectorSelected}
					btnDisabled={!connectorMeta ? true : false}
					type={type}
				/>
			),
		},
		{
			title:
				type === "SRC"
					? appConstants.CONNECT_SRC_CONNECTOR
					: appConstants.CONNECT_DEST_CONNECTOR,
			content: (
				<SpecCpn
					connectorMeta={connectorMeta}
					workspaceId={workspaceId}
					prev={prev}
					formRef={formRef}
				/>
			),
		},
	];

	return (
		<PageLayout displayHeader={false}>
			<StepCpn
				steps={steps}
				current={currSrcStep}
				contentStyle={contentStyle}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						marginTop: 20,
					}}
				>
					{currSrcStep < steps.length - 1 && (
						<CustomButton
							title={buttons.NEXT_BUTTON}
							onClick={next}
							size="large"
							disabled={isNextButtonDisabled}
						/>
					)}
				</div>
			</StepCpn>
		</PageLayout>
	);
};

export default NewConnection;
