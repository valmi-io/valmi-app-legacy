import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import passport from "../../../../lib/passport-google-auth";

export default nextConnect().get(
	passport.authenticate("google", { session: false }),
	(req: NextApiRequest & { user: any }, res: NextApiResponse) => {
		// you can save the user session here. to get access to authenticated user through req.user
		res.redirect(
			"/add_credential?provider=google&client_id=" +
				process.env.AUTH_GOOGLE_CLIENT_ID +
				"&client_secret=" +
				process.env.AUTH_GOOGLE_CLIENT_SECRET +
				"&access_token=" +
				req.user["_accessToken"] +
				"&refresh_token=" +
				req.user["_refreshToken"] +
				"&provider=google&email=" +
				req.user.emails[0].value +
				"&unique_id=" +
				req.user.emails[0].value +
				"&name=" +
				req.user.displayName +
				"&id=" +
				req.user.id +
				"&image=" +
				req.user.photos[0].value
		);
	}
);
