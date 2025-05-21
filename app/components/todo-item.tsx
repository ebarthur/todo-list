import clsx from "clsx";
import React from "react";
import { age } from "~/lib/dates";
import type { Task } from "~/lib/types";
import { TaskComments } from "./task-comments";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { AssigneeMenu } from "./assignee-menu";
import { StatusMenu } from "./status-menu";
import { useFetcher } from "@remix-run/react";

// TODO: on hover the status bar should show who created the task and when

interface Props {
	task: Task;
	onTaskUpdate?: (task: Task) => void;
}

export function TodoItem({ task, onTaskUpdate }: Props) {
	const [opened, setOpened] = React.useState(false);
	const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] =
		React.useState(false);
	const [isStatusPopoverOpen, setIsStatusPopoverOpen] = React.useState(false);

	const fetcher = useFetcher();

	React.useEffect(() => {
		if (fetcher.data?.task) {
			onTaskUpdate?.(fetcher.data.task);
		}
	}, [fetcher.data, onTaskUpdate]);

	function updateTask(
		taskId: number,
		updates: { assignee?: string; status?: string },
	) {
		fetcher.submit(JSON.stringify({ taskId, ...updates }), {
			method: "PATCH",
			action: "/list",
			encType: "application/json",
		});

		if (updates.assignee) {
			setIsAssigneePopoverOpen(false);
			return;
		}
		setIsStatusPopoverOpen(false);
	}

	const handleToggleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {		if (
			e.target instanceof HTMLElement &&
			(e.target.closest("[data-assignee-button]") ||
				e.target.closest("[data-status-button]") ||
				e.target.closest(".popover-content"))
		) {
			return;
		}
		setOpened(!opened);
	};

	return (
		<div>
			<div
				className="flex items-center gap-4 p-2 hover:bg-stone-200 dark:hover:bg-neutral-800 focus:bg-stone-200 dark:focus:bg-neutral-800 cursor-pointer"
				onClick={handleToggleOpen}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleToggleOpen(e);
					}
				}}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
				tabIndex={0}
			>
				<Popover
					open={isStatusPopoverOpen}
					onOpenChange={setIsStatusPopoverOpen}
					placement="bottom-start"
				>
					<PopoverTrigger asChild>
						<button
							data-status-button
							type="button"
							className={clsx(
								"size-6 rounded-full border-2 border-stone-300 dark:border-neutral-700 flex items-center justify-center",
								{
									"!border-amber-500": task.status === "inProgress",
									"!border-green-500": task.status === "done",
								},
							)}
							onClick={(e) => {
								e.stopPropagation();
								setIsStatusPopoverOpen(!isStatusPopoverOpen);
							}}
							onKeyDown={(e) => {
								e.stopPropagation();
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setIsStatusPopoverOpen(!isStatusPopoverOpen);
								}
							}}
						>
							{task.status === "done" && (
								<div className="i-lucide-check opacity-50" />
							)}
						</button>
					</PopoverTrigger>
					<PopoverContent className="z-50 popover-content">
						<StatusMenu
							status={task.status}
							onStatusSelect={(newStatus) =>
								updateTask(task.id, { status: newStatus })
							}
						/>
					</PopoverContent>
				</Popover>

				<div className="flex-1">
					<div className="flex items-center justify-between">
						<div
							className={clsx("font-medium", {
								"line-through font-normal text-secondary":
									task.status === "done",
							})}
						>
							{task.title}
						</div>
					</div>
				</div>

				<div className="flex gap-3 items-center">
					<Popover
						open={isAssigneePopoverOpen}
						onOpenChange={setIsAssigneePopoverOpen}
						placement="bottom-end"
					>
						<PopoverTrigger asChild>
							<button
								data-assignee-button
								type="button"
								className="flex items-center gap-1 bg-transparent text-sm font-mono text-secondary"
								onClick={(e) => {
									e.stopPropagation();
									setIsAssigneePopoverOpen(!isAssigneePopoverOpen);
								}}
								onKeyDown={(e) => {
									e.stopPropagation();
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										setIsAssigneePopoverOpen(!isAssigneePopoverOpen);
									}
								}}
							>
								<img
									src={`https://api.dicebear.com/9.x/dylan/svg?seed=${task.assignee}`}
									className="rounded-full size-5 bg-blue-500"
									alt={task.assignee}
								/>{" "}
								@{task.assignee}
							</button>
						</PopoverTrigger>

						<PopoverContent className="z-50 popover-content">
							<AssigneeMenu
								assignee={task.assignee}
								onTeamMemberSelect={(newAssignee) =>
									updateTask(task.id, { assignee: newAssignee })
								}
							/>
						</PopoverContent>
					</Popover>

					<div className="text-sm text-secondary">{age(task.createdAt)}</div>

					<div className="flex gap-1 text-sm items-center text-secondary">
						<div className="i-solar-chat-line-line-duotone" /> {task.comments}
					</div>
				</div>
			</div>

			<TaskComments opened={opened} taskId={task.id} />
		</div>
	);
}
