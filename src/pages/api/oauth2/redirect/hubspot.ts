import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import passport from "../../../../lib/passport-hubspot";

export default nextConnect().get(
	passport.authenticate("hubspot", { session: false }),
	(req: NextApiRequest & { user: any }, res: NextApiResponse) => {
		// you can save the user session here. to get access to authenticated user through req.user
		//console.log("req.user", req.user);
		//console.log(req, res);
		res.redirect(
			"/add_credential?provider=hubspot&client_id=" +
				process.env.AUTH_HUBSPOT_CLIENT_ID +
				"&client_secret=" +
				process.env.AUTH_HUBSPOT_CLIENT_SECRET +
				"&access_token=" +
				req.user["_accessToken"] +
				"&refresh_token=" +
				req.user["_refreshToken"] +
				"&hub_id=" +
				req.user["hub_id"] +
				"&email=" +
				req.user.user +
				"&unique_id=" +
				req.user.user_id +
				"&name=" +
				req.user.user.split('@')[0] +
				"&id=" +
				req.user.user_id +
				"&image=" +
				null
		);
	}
);
