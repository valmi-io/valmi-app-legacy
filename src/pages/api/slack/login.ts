import passport from "../../../lib/passport-slack";
import nextConnect from "next-connect";
const { parse } = require("url");

export default nextConnect()
	.use(passport.initialize())
	.get(
		passport.authenticate("slack", { failureRedirect: '/oauth_signin_failure'})
	);
