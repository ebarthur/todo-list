import { type LoaderFunctionArgs, redirect } from "react-router";
import { prisma } from "~/lib/prisma.server";
import { badRequest } from "~/lib/responses";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id: token } = params;

	if (!token) {
		throw badRequest({ error: "token is required" });
	}

	const invite = await prisma.inviteToken.findFirst({
		where: {
			token,
			used: false,
			expiresAt: {
				gte: new Date(),
			},
		},
	});

	if (!invite) {
		throw badRequest({ error: "invalid/expired token" });
	}

	return redirect(`/login?invite=${invite.token}`);
};
