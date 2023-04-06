import passport from "../../lib/passport-google-auth";
import nextConnect from "next-connect";
const { parse } = require("url");

export default nextConnect()
	.use(passport.initialize())
	.get(
		passport.authenticate("google", {
			scope: [
				"profile",
				"email",
				"https://www.googleapis.com/auth/spreadsheets",
			],
			session: false,
			accessType: "offline",
			prompt: "consent",
		})
	);
