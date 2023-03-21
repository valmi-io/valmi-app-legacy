import { useRouter } from "next/router";

const SyncDetails = (props) => {
	const router = useRouter();
	const { sid } = router.query;
	return (
		<>
			<p>Display details for this sync id:_{sid}</p>
		</>
	);
};

const propTypes = {};

const defaultProps = {};

SyncDetails.proptypes = propTypes;
SyncDetails.defaultProps = defaultProps;

export default SyncDetails;
