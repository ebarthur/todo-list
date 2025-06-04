import { redirect } from "react-router";
import { authCookie } from "~/lib/cookies.server";

export const loader = async () => {
	return redirect("/auth", {
		headers: {
			"Set-Cookie": await authCookie.serialize("auth", {
				maxAge: 0,
			}),
		},
	});
};
