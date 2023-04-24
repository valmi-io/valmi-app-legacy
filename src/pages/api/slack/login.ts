import passport from "../../../lib/passport-slack";
import nextConnect from "next-connect";
const { parse } = require("url");

// To Test locally use https://localhost - use local-ssl-proxy npm package
export default nextConnect()
	.use(passport.initialize())
	.get(
		passport.authenticate("slack", { failureRedirect: '/oauth_signin_failure'})
	);
