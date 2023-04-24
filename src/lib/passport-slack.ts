
import { Strategy as SlackStrategy } from "./passport-slack/index";
import { redirect } from "next/dist/server/api-utils";
import passport from "passport";

// logic to save your user or check if user exists in your record to proceed.
const saveUser = (user) => {
	//console.log(user);
  return new Promise((resolve, reject) => {
    resolve("Successful");
  });
};

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.AUTH_SLACK_CLIENT_ID as string,
      clientSecret: process.env.AUTH_SLACK_CLIENT_SECRET as string,
		user_scope: ['identity.basic','identity.email'],
		scope: ['users.profile:read','chat:write','channels:read','channels:join'], // default,
		callbackURL: 'https://localhost/api/oauth2/redirect/slack',

    },
    async (accessToken, params, profile, cb: any) => {
      try {
		//console.log(profile);
		profile["_accessToken"] = accessToken;
		profile["_refreshToken"] = null;
		profile["_bot_user_id"] = params.bot_user_id;
        await saveUser(profile);
        return cb(null, profile);
      } catch (e: any) {
        throw new Error(e);
      }
    }
  )
);


// passport.serializeUser stores user object passed in the cb method above in req.session.passport
passport.serializeUser((user, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// passport.deserializeUser stores the user object in req.user
passport.deserializeUser(function (
  user: any,
  cb: (arg0: null, arg1: any) => any
) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// for broader explanation of serializeUser and deserializeUser visit https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

// An article that explains the concept of process.nextTick https://nodejs.dev/learn/understanding-process-nexttick

export default passport;
