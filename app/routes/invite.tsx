import { getInviteLink } from "~/lib/get-invite-link";

export const loader = async () => {
	const url = await getInviteLink();

	return { url };
};
