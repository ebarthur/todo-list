import type { Status } from "@prisma/client";
import clsx from "clsx";

interface StatusMenuProps {
	status: string;
	onStatusSelect: (status: string) => void;
}

interface StatusProps {
	name: Status;
	label: string;
	icon: string;
}

const statuses: StatusProps[] = [
	{
		name: "pending",
		label: "Pending",
		icon: "i-lucide-circle text-secondary",
	},
	{
		name: "inProgress",
		label: "In Progress",
		icon: "i-lucide-loader-circle text-amber",
	},
	{
		name: "done",
		label: "Done",
		icon: "i-solar-check-circle-outline text-green-500",
	},
];

export function StatusMenu({ onStatusSelect, status }: StatusMenuProps) {
	return (
		<div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg w-[14rem] border dark:border-neutral-800 overflow-hidden shadow-lg mt-1.5">
			<header className="px-2 py-2.5 flex items-center justify-start">
				<div className="text-sm font-semibold ms-2 text-secondary">
					Change status...
				</div>
			</header>

			<hr className="dark:border-neutral-800" />

			<ul className="space-y-1 p-1">
				{statuses.map((s) => (
					<li
						key={s.name}
						className={clsx(
							"flex items-center pl-3 rounded-lg  hover:bg-neutral-200/80 dark:hover:bg-neutral-800/20",
							{
								"bg-neutral-200/80 dark:bg-neutral-800/20": s.name === status,
							},
						)}
					>
						<div className={clsx("size-5", s.icon)} />

						<button
							type="button"
							className="w-full flex items-center justify-between py-2 px-3 bg-transparent font-mono"
							onClick={(e) => {
								e.stopPropagation();
								onStatusSelect(s.name);
							}}
						>
							<span>{s.label}</span>
							{s.name === status && <div className="i-lucide-check size-5" />}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
