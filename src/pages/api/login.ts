
import passport from "../../lib/passport-google-auth";
import nextConnect from "next-connect";
const { parse } = require('url')

export default nextConnect()
  .use(passport.initialize())
  .get(
	passport.authenticate("google", {
      scope: ["profile", "email"],
	  session: false,
	  accessType: 'offline',
	  prompt: 'consent',

    })
  );
