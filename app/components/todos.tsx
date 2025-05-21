import type { Task } from "@prisma/client";
import React from "react";
import { usePaginatedResults } from "~/lib/use-paginated-results";
import { TaskComposer } from "./task-composer";
import { TodoItem } from "./todo-item";

async function load(previous: Task[][]) {
	const res = await fetch(`/list?page=${previous.length}`);
	const data = await res.json();

	return data.tasks;
}

export function Todos() {
	const { results } = usePaginatedResults(load);
	const [newEntries, setNewEntries] = React.useState<Task[]>([]);
	const [localResults, setLocalResults] = React.useState<Task[][]>(results);

	React.useEffect(() => {
		setLocalResults(results);
	}, [results]);

	const handleNewEntry = React.useCallback((task: Task) => {
		setNewEntries((prev) => [task, ...prev]);
	}, []);

	const handleTaskUpdate = React.useCallback((updatedTask: Task) => {
		setNewEntries((prev) =>
			prev.map((task) =>
				task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
			),
		);
		setLocalResults((prev) =>
			prev.map((page) =>
				page.map((task) =>
					task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
				),
			),
		);
	}, []);

	return (
		<div className="overflow-y-auto h-full">
			<ul className="divide-y divide-stone-200 dark:divide-neutral-700/50">
				<li className="sticky top-0 z-10">
					<TaskComposer onNewEntry={handleNewEntry} />
				</li>

				{[...newEntries, ...localResults.flat()].map((task) => (
					<li key={task.id}>
						<TodoItem task={task} onTaskUpdate={handleTaskUpdate} />
					</li>
				))}
			</ul>
		</div>
	);
}
