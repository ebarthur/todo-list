import { authCookie } from "./cookies.server";
import { prisma } from "./prisma.server";
import { unauthorized } from "./responses";

export async function checkAuth(request: Request) {
	const { userId } =
		(await authCookie.parse(request.headers.get("Cookie"))) || {};

	if (!userId) throw unauthorized();

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			omit: { password: true },
		});

		if (!user) throw new Error("User not found");
		return user;
	} catch (err) {
		console.error(err);
		throw unauthorized();
	}
}

export async function checkAccess(request: Request, projectSlug: string) {
	const user = await checkAuth(request);
	const access = await prisma.projectAccess.findFirst({
		where: {
			userId: user.id,
			project: { slug: projectSlug },
		},
	});

	if (!access) throw unauthorized();

	const project = await prisma.project.findFirst({
		where: { slug: projectSlug },
	});

	return { user, project };
}
