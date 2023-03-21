import Title from "src/components/Title";

const LinkConfirmation = ({ title, children }) => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
			}}
		>
			<Title level={2} title={title} />
			{children}
		</div>
	);
};

export default LinkConfirmation;
