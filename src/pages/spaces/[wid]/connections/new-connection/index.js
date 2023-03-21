import { useRouter } from "next/router";
import React from "react";

import Head from "src/components/Head";
import NewConnection from "src/containers/Connections/NewConnection";

const NewConnectionsPage = () => {
	const router = useRouter();
	const { connector_type } = router.query;
	return (
		<>
			<Head title="Connection" />
			<NewConnection type={connector_type} />
		</>
	);
};

export default NewConnectionsPage;
