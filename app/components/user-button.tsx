import { useLoaderData } from "react-router";
import type { loader } from "~/routes/_index";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { UserMenu } from "./user-menu";

export function UserButton() {
	const { user } = useLoaderData<typeof loader>();

	return (
		<Popover placement="bottom-end">
			<PopoverTrigger className="bg-stone-200/50 dark:bg-neutral-800/50 px-2 py-1 rounded-full">
				<div className="flex gap-2">
					<img
						src={`https://api.dicebear.com/9.x/dylan/svg?seed=${user.username}`}
						className="size-6 rounded-full bg-amber-500"
						alt="blackmann"
					/>
					<div className="font-mono">{user.username}</div>
				</div>
			</PopoverTrigger>
			
			<PopoverContent className="z-100">
				<UserMenu />
			</PopoverContent>
		</Popover>
	);
}
