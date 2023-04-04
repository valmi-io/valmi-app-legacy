import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import passport from "../../../../lib/passport-google-auth";

export default nextConnect().get(
  passport.authenticate("google",{	  session: false,
  }),
  (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    // you can save the user session here. to get access to authenticated user through req.user
    res.redirect("/add_crendential?accessToken=" + req.user["_accessToken"] + "&refreshToken=" + req.user["_refreshToken"] + "&provider=google&email=" + req.user.emails[0].value + "&name=" + req.user.displayName + "&id=" + req.user.id + "&image=" + req.user.photos[0].value  );
  }
);
