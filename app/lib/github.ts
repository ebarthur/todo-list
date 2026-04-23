import type { Task } from "@prisma/client";
import { TASK_ID_REGEX } from "./constants";
import { prisma } from "./prisma.server";
import { sendWebhook } from "./webhook";

interface GitHubPullRequestEvent {
	action: string;
	pull_request: {
		head: {
			ref: string;
		};
		html_url: string;
		number: number;
		merged: boolean;
	};
}

async function handlePROpened(event: GitHubPullRequestEvent) {
	const branchName = event.pull_request.head.ref;
	const taskId = extractTaskId(branchName);

	if (!taskId) return;

	const task = await prisma.task.findUnique({
		where: { id: taskId },
	});

	if (task) {
		await updateTask({
			taskId: task.id,
			updates: {
				status: "inReview",
				githubPrUrl: event.pull_request.html_url,
				githubPrNumber: event.pull_request.number,
			},
		});

		sendWebhook("task.pr_opened", {
			task,
			prUrl: event.pull_request.html_url,
			prNumber: event.pull_request.number,
			branchName,
			projectId: task.projectId,
		});
	}
}

async function handlePRMerged(event: GitHubPullRequestEvent) {
	const branchName = event.pull_request.head.ref;
	const taskId = extractTaskId(branchName);

	if (!taskId) return;

	const task = await prisma.task.findUnique({
		where: { id: taskId },
	});

	if (task) {
		await updateTask({
			taskId: task.id,
			updates: {
				status: "done",
			},
		});

		sendWebhook("task.pr_merged", {
			task,
			prUrl: event.pull_request.html_url,
			prNumber: event.pull_request.number,
			branchName,
			projectId: task.projectId,
		});
	}
}

function extractTaskId(branchName: string): number | null {
	const parts = branchName.split(/[\/\-_]/);

	for (const part of parts) {
		const match = part.match(TASK_ID_REGEX);
		if (match) {
			return Number.parseInt(match[1]);
		}
	}

	return null;
}

async function updateTask({
	taskId,
	updates,
}: {
	taskId: number;
	updates: Partial<Task>;
}): Promise<Task> {
	return await prisma.task.update({
		where: { id: taskId },
		data: updates,
	});
}

export { handlePRMerged, handlePROpened, type GitHubPullRequestEvent };
