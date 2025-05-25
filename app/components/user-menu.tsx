import clsx from "clsx";
import React from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import type { loader } from "~/routes/_index";
import { InviteCard } from "./invite-card";

function UserMenu() {
	const { user } = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const [showInvite, setShowInvite] = React.useState(false);

	const handleLogout = () => {
		const confirmed = window.confirm("Are you sure you want to logout?");
		if (confirmed) {
			navigate("/logout");
		}
	};

	return (
		<div
			className={clsx(
				"transition-[width,min-width] duration-300 ease-in-out will-change-width bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800 overflow-hidden shadow-lg mt-1.5",
				{
					"min-w-14rem w-14rem": !showInvite,
					"min-w-17.8rem w-17.8rem": showInvite,
				},
			)}
		>
			{!showInvite ? (
				<>
					{user.superUser && (
						<div>
							<header className="p-2 flex text-sm items-center justify-start">
								<div className="bg-stone-200 dark:bg-neutral-800 px-2 rounded-lg flex gap-2 items-center text-secondary">
									<div className="i-lucide-crown text-amber-500" />
									Super User
								</div>
							</header>

							<hr className="dark:border-neutral-800" />
						</div>
					)}
					<ul className="font-medium p-1">
						{user.superUser && (
							<li>
								<button
									type="button"
									onClick={() => setShowInvite(true)}
									className="bg-transparent w-full flex gap-2 items-center py-1.5 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg"
								>
									<div className="i-solar-users-group-rounded-linear" />
									Invite a Teammate
								</button>
							</li>
						)}
						<li>
							<Link
								to="/change-password"
								className="w-full flex gap-2 items-center py-1.5 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg"
							>
								<div className="i-solar-lock-password-linear" />
								Change Password
							</Link>
						</li>
						<li>
							<button
								type="button"
								onClick={handleLogout}
								className="bg-transparent w-full flex gap-2 items-center py-1.5 px-2 text-red-500 hover:bg-red-600/5 rounded-lg"
							>
								<div className="i-solar-logout-2-outline" />
								Logout
							</button>
						</li>
					</ul>
				</>
			) : (
				<InviteCard onClose={() => setShowInvite(false)} />
			)}
		</div>
	);
}

export { UserMenu };
