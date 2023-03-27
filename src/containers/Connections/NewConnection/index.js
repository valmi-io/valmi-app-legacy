/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ConnectorCpn from "src/components/ConnectionCpn/Connector";
import PageLayout from "src/components/Layout/PageLayout";
import SpecCpn from "src/components/ConnectionCpn/Spec";
import StepCpn from "src/components/Step";
import appConstants from "src/constants/app";
import CustomButton from "src/components/Button/Button";
import buttons from "src/constants/buttons";
import { useRouter } from "next/router";
import Title from "src/components/Title";

const NewConnection = (props) => {
	console.log("New connection props:-", props);
	const router = useRouter();
	const { type = "SRC" } = props;

	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	const formRef = useRef(null);
	const [currSrcStep, setCurrSrcStep] = useState(0);
	const [connectorMeta, setConnectorMeta] = useState(null);

	const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

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
		<PageLayout
			displayHeader={false}
			containerStyles={{
				width: "60%",
				height: "100%",
			}}
		>
			<Title
				title={`Create ${type === "SRC" ? "Warehouse" : "Destination"}`}
				level={4}
				classnames={"mb-3"}
			/>
			<StepCpn steps={steps} current={currSrcStep}>
				{currSrcStep < steps.length - 1 && (
					<div className="mt-3 d-flex justify-content-end">
						<CustomButton
							title={buttons.NEXT_BUTTON}
							onClick={next}
							size="large"
							disabled={isNextButtonDisabled}
						/>
					</div>
				)}
			</StepCpn>
		</PageLayout>
	);
};

export default NewConnection;
