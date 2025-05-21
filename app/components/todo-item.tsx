import clsx from "clsx";
import React from "react";
import { age } from "~/lib/dates";
import type { Task } from "~/lib/types";
import { TaskComments } from "./task-comments";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { AssigneeMenu } from "./assignee-menu";
import { useFetcher } from "@remix-run/react";

// TODO: on hover the status bar should show who created the task and when

interface Props {
	task: Task;
	onTaskUpdate?: (task: Task) => void;
}

export function TodoItem({ task, onTaskUpdate }: Props) {
	const [opened, setOpened] = React.useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
	const fetcher = useFetcher();

	const optimisticAssignee =
		fetcher.formData?.get("assignee")?.toString() || task.assignee;

	React.useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data?.task) {
			onTaskUpdate?.(fetcher.data.task);
		}
	}, [fetcher.state, fetcher.data, onTaskUpdate]);

	function assignTask(taskId: number, assignee: string) {
		fetcher.submit(JSON.stringify({ taskId, assignee }), {
			method: "PATCH",
			action: "/list",
			encType: "application/json",
		});

		setIsPopoverOpen(false);
	}

	const handleToggleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
		// Prevent toggle when clicking assignee button
		if (
			e.target instanceof HTMLElement &&
			e.target.closest("[data-assignee-button]")
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
				<div
					className={clsx(
						"size-6 rounded-full border-2 border-stone-300 dark:border-neutral-700 flex items-center justify-center",
						{
							"!border-amber-500": task.status === "inProgress",
						},
					)}
				>
					{task.status === "done" && (
						<div className="i-lucide-check opacity-50" />
					)}
				</div>

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
						open={isPopoverOpen}
						onOpenChange={setIsPopoverOpen}
						placement="bottom-end"
					>
						<PopoverTrigger asChild>
							<div
								data-assignee-button
								onClick={(e) => {
									e.stopPropagation();
									setIsPopoverOpen(!isPopoverOpen);
								}}
								onKeyDown={(e) => {
									e.stopPropagation();
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										setIsPopoverOpen(!isPopoverOpen);
									}
								}}
							>
								<button
									type="button"
									className="flex items-center gap-1 bg-transparent text-sm font-mono text-secondary"
								>
									<img
										src={`https://api.dicebear.com/9.x/dylan/svg?seed=${optimisticAssignee}`}
										className="rounded-full size-5 bg-blue-500"
										alt={optimisticAssignee}
									/>{" "}
									@{optimisticAssignee}
								</button>
							</div>
						</PopoverTrigger>

						<PopoverContent className="z-50">
							<AssigneeMenu
								assignee={optimisticAssignee}
								onTeamMemberSelect={(newAssignee) =>
									assignTask(task.id, newAssignee)
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
