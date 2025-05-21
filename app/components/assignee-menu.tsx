interface AssigneeMenuProps {
	assignee: string;
	onTeamMemberSelect: (assignee: string) => void;
}

function AssigneeMenu({ onTeamMemberSelect, assignee }: AssigneeMenuProps) {
	// []: load team members from a loader
	const team = [
		{ id: "user-1", name: "notgr" },
		{ id: "user-2", name: "ebarthur" },
		{ id: "user-3", name: "blackmann" },
	];

	return (
		<div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg w-[16rem] border dark:border-neutral-800 overflow-hidden shadow-lg mt-1.5">
			<header className="px-2 py-2.5 flex items-center justify-start">
				<div className="text-sm font-semibold ms-2 text-secondary">
					{/* TODO: make this an input to search team members*/}
					Assign to...
				</div>
			</header>

			<hr className="dark:border-neutral-800" />

			<div className="p-1">
				{" "}
				<div className="w-full rounded-lg flex items-center justify-between py-2 px-3 text-secondary bg-transparent font-mono hover:bg-neutral-200/80 dark:hover:bg-neutral-800/20">
					<div className="flex gap-2">
						<img
							src={`https://api.dicebear.com/9.x/dylan/svg?seed=${assignee}`}
							className="rounded-full size-5 bg-blue-500"
							alt={assignee}
						/>
						{assignee}
					</div>

					<div className="i-lucide-check size-5" />
				</div>
			</div>

			<div className="text-sm font-semibold ms-3 text-secondary">
				Team members
			</div>

			<ul className="p-1">
				{team
					.filter((member) => member.name !== assignee)
					.map((member) => (
						<li key={member.id}>
							<button
								type="button"
								className="w-full rounded-lg flex gap-2 items-center bg-transparent py-2 px-3 font-mono hover:bg-neutral-200/80 dark:hover:bg-neutral-800/20"
								onClick={(e) => {
									e.stopPropagation();
									onTeamMemberSelect(member.name);
								}}
							>
								<img
									src={`https://api.dicebear.com/9.x/dylan/svg?seed=${member.name}`}
									className="rounded-full size-5 bg-blue-500"
									alt={member.name}
								/>{" "}
								{member.name}
							</button>
						</li>
					))}
			</ul>
		</div>
	);
}

export { AssigneeMenu };
