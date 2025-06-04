import { useAtom } from "jotai";
import { assigneeAtom, filterStatusAtom, searchAtom } from "~/lib/store";
import { useTasks } from "~/lib/use-tasks";
import { LoadingButton } from "./loading-button";
import { TaskComposer } from "./task-composer";
import { TodoItem } from "./todo-item";
import { useLoaderData } from "react-router";
import type { loader } from "~/routes/_index";

export function Todos() {
	const [assigneeId] = useAtom(assigneeAtom);
	const [search] = useAtom(searchAtom);
	const [status] = useAtom(filterStatusAtom);

	const { project_id } = useLoaderData<typeof loader>()

	const { query } = useTasks({ assigneeId, search, status });
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = query;

	const tasks = data?.pages.flat();

	return (
		<div className="overflow-y-auto h-full">
			{project_id !== undefined ? <ul className="divide-y divide-stone-200 dark:divide-neutral-700/50">
				<li className="sticky top-0 z-10">
					<TaskComposer />
				</li>

				{tasks?.map((task) => (
					<li key={task.id} hidden={task.projectId !== Number(project_id)} id={task.id.toString()}>
						<TodoItem task={task} />
					</li>
				))}

				<li className="p-4 text-center">
					<LoadingButton
						onClick={() => fetchNextPage()}
						isLoading={isFetchingNextPage}
						done={!hasNextPage && !isFetchingNextPage}
					/>
				</li>
			</ul> : <div className="flex flex-col gap-3 justify-center items-center h-full">
				<div className="i-solar-bill-cross-bold-duotone size-6" />
				<span>No project selected</span>
			</div>}
		</div>
	);
}
