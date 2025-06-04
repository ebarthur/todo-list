import { addHours } from "date-fns";
import { customAlphabet } from "nanoid";
import type { LoaderFunctionArgs } from "react-router";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { unauthorized } from "~/lib/responses";

const generateToken = customAlphabet(
	"abcde0123456789fghijklmnABCDEFGHNOPopqrstWXYZuvwxyz",
	10,
);

export const loader = async ({  request }: LoaderFunctionArgs) => {
	const user = await checkAuth(request);

	if (!user.superUser) {
		throw unauthorized();
	}

	const expiresAt = addHours(new Date(), 12);
	const token = generateToken();

	const url = new URL(request.url);
	const project = url.searchParams.get("project");

	await prisma.inviteToken.create({
		data: { token, expiresAt, project: { connect: { slug: project! } } },
	});

	return { token };
};
