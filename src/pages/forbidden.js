/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import React from "react";
import Head from "next/head";

const ForbiddenPage = (props) => {
	return (
		<>
			<Head>
				<title>403: Forbidden/Access Denied</title>
			</Head>
			<div
				style={{
					color: "rgb(0, 0, 0)",
					background: "rgb(255, 255, 255)",
					fontFamily:
						"-apple-system, BlinkMacSystemFont, Roboto, &quot;Segoe UI&quot;, &quot;Fira Sans&quot;, Avenir, &quot;Helvetica Neue&quot;, &quot;Lucida Grande&quot;, sans-serif",
					height: "100vh",
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div>
					<h1
						style={{
							display: "inline-block",
							borderRight: "1px solid rgba(0, 0, 0, 0.3)",
							margin: "0px 20px 0px 0px",
							padding: "10px 23px 10px 0px",
							fontSize: "24px",
							fontWeight: "500",
							verticalAlign: "top",
						}}
					>
						403
					</h1>
					<div
						style={{
							display: "inline-block",
							textAlign: "left",
							lineHeight: "49px",
							height: "49px",
							verticalAlign: "middle",
						}}
					>
						<h2
							style={{
								fontSize: "14px",
								fontWeight: "normal",
								lineHeight: "inherit",
								margin: "0px",
								padding: "0px",
							}}
						>
							Forbidden/Access Denied.
						</h2>
					</div>
				</div>
			</div>
		</>
	);
};

ForbiddenPage.Layout = ({ children }) => children;

export default ForbiddenPage;
