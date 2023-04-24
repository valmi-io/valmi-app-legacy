import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import passport from "../../../../lib/passport-slack";

export default nextConnect().get(
	passport.authenticate("slack", { session: false }),
	(req: NextApiRequest & { user: any }, res: NextApiResponse) => {
		// you can save the user session here. to get access to authenticated user through req.user
		//console.log("req.user", req.user);

		res.redirect(
			"/add_credential?provider=slack&client_id=" +
				process.env.AUTH_SLACK_CLIENT_ID +
				"&client_secret=" +
				process.env.AUTH_SLACK_CLIENT_SECRET +
				"&access_token=" +
				req.user["_accessToken"] +
				"&refresh_token=" +
				req.user["_refreshToken"] +
				"&bot_user_id=" +
				req.user["_bot_user_id"] +
				"&email=" +
				req.user.profile.email +
				"&unique_id=" +
				req.user.profile.email +
				"&name=" +
				req.user.profile.real_name +
				"&id=" +
				req.user.profile.email +
				"&image=" +
				req.user.profile.image_original
		);
	}
);
