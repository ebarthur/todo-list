import type { Prisma } from "@prisma/client";
import type { loader as commentsLoader } from "~/routes/comments";

export type Comment = Awaited<
	ReturnType<typeof commentsLoader>
>["comments"][number];

export type Task = Prisma.TaskGetPayload<{
	include: {
		assignee: true;
		author: true;
		project: true;
	};
}> & {
	comments: number;
};

export type ProjectWithTaskCount = Prisma.ProjectGetPayload<{
	include: {
		_count: {
			select: {
				Task: true;
			};
		};
	};
}>;
