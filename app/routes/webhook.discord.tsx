import type { ActionFunctionArgs } from "react-router";
import { data as json } from "react-router";
import { methodNotAllowed } from "~/lib/responses";
import { sendDiscord } from "~/lib/send-discord";
import type { AnyWebhookEvent } from "~/lib/webhook-types";

export async function action({ request }: ActionFunctionArgs) {
	if (request.method !== "POST") throw methodNotAllowed();

	const event = (await request.json()) as AnyWebhookEvent;

	const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL!;

	await sendDiscord(event, discordWebhookUrl);

	return json({ success: true });
}
