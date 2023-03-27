import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Head from "src/components/Head";
import PageLayout from "src/components/Layout/PageLayout";
import SyncDetails from "src/components/SyncCpn/Details";
import SyncRuns from "src/components/SyncCpn/Runs";

const SyncRunsPage = () => {
	const router = useRouter();
	const { sid = "1" } = router.query;

	const user = useSelector((state) => state.user);

	const { workspaceId = "" } = user || {};

	return (
		<>
			<Head title="Sync" />
			<PageLayout displayCreateBtn={false} headerTitle={"Sync Details"}>
				<SyncDetails syncID={sid} workspaceID={workspaceId} />
				<SyncRuns syncID={sid} workspaceID={workspaceId} />
			</PageLayout>
		</>
	);
};

export default SyncRunsPage;
