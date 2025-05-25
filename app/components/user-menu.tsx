import clsx from "clsx";
import React from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import type { loader } from "~/routes/_index";
import { CopyButton } from "./copy-button";
import { Input } from "./input";

function UserMenu() {
	const { user } = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const [showInvite, setShowInvite] = React.useState(false);
	const fetcher = useFetcher();

	const fetched = React.useRef(false);

	React.useEffect(() => {
		if (showInvite && !fetched.current && fetcher.state === "idle") {
			fetcher.load("/invite");
			fetched.current = true;
		}

		if (!showInvite) {
			fetched.current = false;
		}
	}, [showInvite, fetcher.state]);

	const inviteLink = fetcher.data?.url || "Loading...";

	const handleLogout = () => {
		const confirmed = window.confirm("Are you sure you want to logout?");
		if (confirmed) {
			navigate("/logout");
		}
	};

	return (
		<div
			className={clsx(
				"transition-[width,min-width] duration-300 ease-in-out will-change-width bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-lg mt-1.5",
				{
					"min-w-14rem w-14rem": !showInvite,
					"min-w-17.8rem w-17.8rem": showInvite,
				},
			)}
		>
			{!showInvite ? (
				<>
					{user.superUser && (
						<header className="p-2 border-b dark:border-neutral-800">
							<div className="inline-block h-full rounded-full px-4 py-2 uppercase bg-neutral-700 text-neutral-100 dark:(bg-neutral-100 text-neutral-900) text-xs font-bold">
								<div className="flex items-center gap-1.5">
									<div className="i-lucide-crown text-amber-600" />
									Super User
								</div>
							</div>
						</header>
					)}
					<ul className="font-medium">
						{user.superUser && (
							<li>
								<button
									type="button"
									onClick={() => setShowInvite(true)}
									className="w-full flex gap-2 items-center py-1.5 px-5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
								>
									<div className="i-solar-users-group-rounded-linear" />
									Invite a Teammate
								</button>
							</li>
						)}
						<li>
							<a
								href="/change-password"
								className="w-full flex gap-2 items-center py-1.5 px-5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
							>
								<div className="i-solar-lock-password-linear" />
								Change Password
							</a>
						</li>
						<li>
							<button
								type="button"
								onClick={handleLogout}
								className="w-full flex gap-2 items-center py-1.5 px-5 text-red-600 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
							>
								<div className="i-solar-logout-2-outline" />
								Logout
							</button>
						</li>
					</ul>
				</>
			) : (
				<div className="text-sm">
					<div className="p-3 space-y-3">
						<div className="flex justify-between gap-2 items-center">
							<div className="font-semibold text-base">Invite a Teammate</div>

							<button
								type="button"
								className="bg-transparent cursor-pointer"
								onClick={() => setShowInvite(false)}
							>
								<div className="i-lucide-x size-5" />
							</button>
						</div>

						<Input
							readOnly
							value={inviteLink}
							className="w-full rounded-lg font-mono border border-neutral-300 dark:border-neutral-700 bg-stone-200 dark:bg-neutral-800 px-2 py-1.5 text-sm truncate"
						/>

						<div className="flex flex-col gap-0">
							<CopyButton
								text={inviteLink}
								disabled={fetcher.state !== "idle" || !fetcher.data}
							/>
							<span className="text-secondary font-mono font-medium ms-1 text-.65rem">
								Single-use link, expires in 12hrs
							</span>
						</div>
					</div>
					<div className="w-full bg-stone-200 dark:bg-neutral-800 p-2">
						<p className="text-xs leading-none font-mono text-neutral-700 dark:text-stone-200 font-medium">
							This link allows one person to join the project
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

export { UserMenu };
