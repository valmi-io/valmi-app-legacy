import React from "react";
import CustomButton from "src/components/Button/Button";

const PageLayout = ({
	headerTitle,
	buttonTitle,
	onClick,
	children,
	displayCreateBtn,
	displayHeader = true,
}) => {
	return (
		<>
			{displayHeader && (
				<div
					style={{
						height: 50,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<h2 style={{ fontWeight: "bold" }}>{headerTitle}</h2>
					{displayCreateBtn && (
						<CustomButton
							title={buttonTitle}
							onClick={onClick}
							size="large"
						/>
					)}
				</div>
			)}

			<div
				style={{
					marginTop: 10,
				}}
			>
				{children}
			</div>
		</>
	);
};

export default PageLayout;
