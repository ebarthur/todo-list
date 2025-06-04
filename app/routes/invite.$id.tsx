import { tryit } from "radashi";
import { type LoaderFunctionArgs, redirect } from "react-router";
import { admit } from "~/lib/auth";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { badRequest } from "~/lib/responses";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { id: token } = params;

	if (!token) {
		throw badRequest({ error: "token is required" });
	}

	const [_, user] = await tryit(checkAuth)(request);

	if (user) {
		return await admit(user, token);
	}

	const invite = await prisma.inviteToken.findFirst({
		where: {
			token,
			used: false,
			expiresAt: { gte: new Date() },
		},
	});

	if (!invite) {
		throw badRequest({ error: "invalid/expired token" });
	}

	return redirect(`/auth?invite=${invite.token}`);
};
