import passport from "../../../lib/passport-hubspot";
import nextConnect from "next-connect";
const { parse } = require("url");

export default nextConnect()
	.use(passport.initialize())
	.get(
		passport.authenticate("hubspot", {
			scope: ["crm.objects.contacts.read",
			"crm.objects.contacts.write",
			"crm.objects.companies.read",
			"crm.objects.companies.write"],
		})
	);
