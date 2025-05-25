import type { LoaderFunctionArgs } from "react-router";
import { getInviteLink } from "~/lib/get-invite-link";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = await getInviteLink();

	return { url };
};
