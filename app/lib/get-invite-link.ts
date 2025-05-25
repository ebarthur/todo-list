import { addHours } from "date-fns";
import { nanoid } from "nanoid";
import { prisma } from "./prisma.server";

export async function getInviteLink() {
	const token = nanoid(24);
	const expiresAt = addHours(new Date(), 12);

	await prisma.inviteToken.create({
		data: {
			token,
			expiresAt,
		},
	});

	const url = process.env.BASE_URL || "http://localhost:5173";

	return `${url}/invite/${token}`;
}
