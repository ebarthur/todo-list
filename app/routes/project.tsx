import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { prisma } from "~/lib/prisma.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const projects = await prisma.project.findMany({
		include: {
			_count: {
				select: {
					Task: true,
				},
			},
		},
	});

	return { projects };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		const data = await request.json();

		const project = await prisma.project.create({
			data,
		});

		return { project };
	}

	if (request.method === "PATCH") {
		const { id, ...data } = await request.json();

		const project = await prisma.project.update({
			where: { id },
			data,
		});

		return { project };
	}

	if (request.method === "DELETE") {
		const { id } = await request.json();

		const project = await prisma.project.delete({
			where: { id },
		});

		return { project };
	}
};
