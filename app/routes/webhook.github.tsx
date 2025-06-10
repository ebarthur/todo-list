import crypto from "node:crypto";
import type { ActionFunctionArgs } from "react-router";
import { handleInstallationEvent, handlePullRequestEvent } from "~/lib/github";
import { badRequest } from "~/lib/responses";

export const action = async ({ request }: ActionFunctionArgs) => {
	const event = await request.json();
	const eventType = request.headers.get("x-github-event");
	const signature = request.headers.get("x-hub-signature-256")!;
	
	verifyRequest(event, signature);

	switch (eventType) {
		case "installation":
			await handleInstallationEvent(event);
			break;
		case "pull_request":
			await handlePullRequestEvent(event);
			break;
	}

	return {};
};

function verifyRequest(event: any, signature: string) {
	const hash = `sha256=${crypto
		.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!)
		.update(JSON.stringify(event))
		.digest("hex")}`;

	if (hash === signature) {
		return true;
	}

	throw badRequest("Verifying request failed");
}
