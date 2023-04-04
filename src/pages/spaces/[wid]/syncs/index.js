import React from "react";
import Head from "src/components/Head";
import Syncs from "src/containers/Syncs/Syncs";
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from "next/link";

const propTypes = {};

const defaultProps = {};

const SyncsPage = (props) => {
// 	const { data, status } = useSession();
//   if (status === 'loading') return <h1> loading... please wait</h1>;
//   if (status === 'authenticated') {
//     return (
//       <div>
//         <h1> hi {data.user.name}</h1>
//         <img src={data.user.image} alt={data.user.name + ' photo'} />
//         <button onClick={signOut}>sign out</button>
//       </div>
//     );
//   }

	return (
		<>
			<Head title="Syncs" />
			<Syncs />

			<h1 style={{ fontSize: "2.5rem" }}>Login with Google</h1>
      <Link href="/api/login?url=/spaces/30224d7c-a795-452a-910e-6c280b410373/syncs" passHref>
        <button
          style={{
            border: "1px solid black",
            backgroundColor: "white",
            borderRadius: "10px",
            height: "50px",
            width: "200px",
            cursor: "pointer",
          }}
        >
          Proceed
        </button>
      </Link>


		</>
	);
};

SyncsPage.propTypes = propTypes;

SyncsPage.defaultProps = defaultProps;

export default SyncsPage;
