import { nanoid } from "nanoid";
import { prisma } from "./prisma.server";

export async function getInviteLink() {
	const token = nanoid(24);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12); // 12 hours

	await prisma.inviteToken.create({
		data: {
			token,
			expiresAt,
		},
	});

	const url = process.env.BASE_URL!;

	return `${url}/invite/${token}`;
}
