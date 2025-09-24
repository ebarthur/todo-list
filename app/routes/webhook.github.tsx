import crypto from "node:crypto";
import type { ActionFunctionArgs } from "react-router";
import {
	type GitHubPullRequestEvent,
	handlePRMerged,
	handlePROpened,
} from "~/lib/github";
import { badRequest } from "~/lib/responses";

export const action = async ({ request }: ActionFunctionArgs) => {
	const event = await request.json();

	const signature = request.headers.get("x-hub-signature-256")!;

	verifyRequest(event, signature);

	switch (event.action) {
		case "opened":
		case "reopened":
			await handlePROpened(event);
			break;
		case "closed":
			if (event.pull_request.merged) {
				await handlePRMerged(event);
			}
			break;
	}

	return {};
};

function verifyRequest(event: GitHubPullRequestEvent, signature: string) {
	const hash = `sha256=${crypto
		.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!)
		.update(JSON.stringify(event))
		.digest("hex")}`;

	if (hash === signature) {
		return true;
	}

	throw badRequest("Verifying request failed");
}
