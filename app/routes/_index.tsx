import { tryit } from 'radashi';
import { type LoaderFunctionArgs, redirect } from "react-router";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const [err, user] = await tryit(checkAuth)(request);

	if (err) {
		throw redirect("/auth");
	}

	const projects = await prisma.project.findMany({
		where: {
			ProjectAccess: {
				some: { userId: user.id },
			},
		},
		orderBy: {
			name: "asc",
		},
		select: {
			slug: true,
		},
	});

	if (projects.length === 0) {
		throw redirect("/logout");
	}

	const top = projects[0];
	return redirect(`/${top.slug}`);
};
