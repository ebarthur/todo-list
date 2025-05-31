import type { EventType, WebhookEvent, WebhookPayload } from "./webhook-types";

export function sendWebhook<T extends EventType>(
	type: T,
	payload: WebhookPayload[T],
): void {
	const webhookUrl = process.env.WEBHOOK_URL;
	if (!webhookUrl) return;

	const event: WebhookEvent<T> = {
		type,
		...payload,
	};

	fetch(webhookUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(event),
	}).catch((error) => {
		console.error("Error sending webhook event:", error);
	});
}
