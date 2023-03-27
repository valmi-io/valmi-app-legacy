/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import React from "react";
import CustomButton from "src/components/Button/Button";
import Title from "src/components/Title";

const PageLayout = ({
	headerTitle,
	buttonTitle,
	onClick,
	children,
	displayCreateBtn,
	displayHeader = true,
	layoutStyles = {},
	containerStyles = {},
}) => {
	return (
		<div
			className={`d-flex w-100 align-items-center flex-column p-3 ${layoutStyles}`}
		>
			{displayHeader && (
				<div className="d-flex w-100 align-items-center justify-content-between mb-2 header-h-50">
					<Title title={headerTitle} level={4} />
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
					width: "100%",
					...containerStyles,
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default PageLayout;
