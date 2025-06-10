import clsx from "clsx";
import React from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import type { loader } from "~/routes/$project";
import { Button } from "./button";
import { InviteCard } from "./invite-card";
import { usePopoverContext } from "./popover";

type View = "default" | "github";

function UserMenu() {
	const { user, installation } = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const [showInvite, setShowInvite] = React.useState(false);
	const [view, setView] = React.useState<View>("default");

	const popover = usePopoverContext();

	function handleLogout() {
		const confirmed = window.confirm("Are you sure you want to logout?");
		if (confirmed) {
			navigate("/logout");
		}
	}

	function to() {
		if (installation) {
			return `https://github.com/settings/installations/${installation.githubInstallationId}`;
		}

		// []: Replace slug <gr-s-todo-list> before merge
		return "https://github.com/apps/gr-s-todo-list/installations/new";
	}

	if (view === "github") {
		return (
			<Container className="!w-17rem text-center p-2">
				<div className="flex gap-2 justify-end items-center">
					<button
						type="button"
						className="bg-transparent cursor-pointer"
						onClick={() => setView("default")}
					>
						<div className="i-lucide-x size-5 text-secondary" />
					</button>
				</div>

				<div className="flex justify-center mb-2 items-center text-secondary relative">
					<div className="i-solar-archive-minimalistic-bold-duotone size-8 text-rose-500" />
					<div className="i-mdi-github size-8 -ml-2.5 text-neutral-800 dark:text-white" />
				</div>

				<h2 className="mb-2">Github Integration</h2>

				{installation ? (
					<p className="text-.8rem font-mono leading-tight text-secondary mb-4 overflow-hidden !w-16rem">
						GitHub integration is{" "}
						<span
							className={clsx(
								"font-medium",
								installation.active
									? "text-green-600 dark:text-green-500"
									: "text-amber-500",
							)}
						>
							{installation.active ? "active" : "paused"}
						</span>
						. Tasks will {installation.active ? "" : "not "}automatically update
						when you open or merge pull requests.
					</p>
				) : (
					<p className="text-.8rem font-mono leading-tight text-secondary mb-4 overflow-hidden !w-16rem">
						Connect Todo List with your GitHub account to automatically update
						the status of tasks.
					</p>
				)}

				<Link
					target="_blank"
					rel="noreferrer noopener"
					to={to()}
					className="w-full"
				>
					<Button
						type="button"
						onClick={() => popover.setOpen(false)}
						className="w-full text-sm font-medium flex items-center justify-center bg-neutral-600 text-white dark:bg-white dark:text-neutral-900 px-3 !py-1.5 gap-1"
					>
						{installation ? "Manage Integration" : "Connect with GitHub"}
					</Button>
				</Link>
			</Container>
		);
	}

	return (
		<Container
			className={clsx({ "!w-14rem": !showInvite, "!w-17rem": showInvite })}
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
									<div className="i-solar-users-group-rounded-linear opacity-50" />
									Invite a Teammate
								</button>
							</li>
						)}

						{user.superUser && (
							<li>
								<button
									type="button"
									onClick={() => setView("github")}
									className={clsx(
										"bg-transparent w-full flex gap-2 items-center py-1.5 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg",
										installation && "opacity-70",
									)}
								>
									<div className="i-mdi-github opacity-50" />
									GitHub Integration{" "}
									{installation && (
										<div
											className={clsx(
												"size-2 rounded-full",
												installation.active
													? "bg-green-600 dark:bg-green-500"
													: "bg-amber-500",
											)}
										/>
									)}
								</button>
							</li>
						)}

						<li>
							<Link
								to="/change-password"
								className="w-full flex gap-2 items-center py-1.5 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg"
							>
								<div className="i-solar-lock-password-linear opacity-50" />
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
		</Container>
	);
}

function Container({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={clsx(
				"transition-width duration-300 ease-in-out will-change-width bg-stone-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800 overflow-hidden shadow-lg mt-1.5 animate-fade-in animate-duration-200",
				className,
			)}
		>
			{children}
		</div>
	);
}

export { UserMenu };
