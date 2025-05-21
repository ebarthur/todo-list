import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";
import { methodNotAllowed } from "~/lib/responses";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const page = Number(url.searchParams.get("page")) || 0;
	const search = url.searchParams.get("search") || "";

	const tasks = await prisma.task.findMany({
		where: {
			title: {
				contains: search,
				mode: "insensitive",
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			_count: {
				select: {
					Comment: true,
				},
			},
		},
		take: 100,
		skip: page * 100,
	});

	const withComments = tasks.map((task) => ({
		...task,
		comments: task._count.Comment,
		_count: undefined,
	}));

	return { tasks: withComments };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "PATCH") {
		const { taskId: id, assignee } = await request.json();

		const task = await prisma.task.update({
			where: {
				id,
			},
			data: {
				assignee,
			},
		});

		return { task };
	}

	if (request.method === "POST") {
		const data = await request.json();

		const task = await prisma.task.create({ data });

		return { task };
	}

	throw methodNotAllowed();
};
