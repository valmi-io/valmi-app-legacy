import AuthLayout from "src/components/Layout/AuthLayout";
import Activate from "src/containers/Auth/Activate";

const ActivatePage = () => {
	return <Activate />;
};

ActivatePage.getLayout = ({ children }) => {
	return <AuthLayout>{children}</AuthLayout>;
};

export default ActivatePage;
