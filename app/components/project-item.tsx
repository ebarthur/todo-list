import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Project } from "~/lib/types";
import { useProject } from "~/lib/use-project";

interface Props {
	project: Project;
}

export function ProjectItem({ project }: Props) {
	const [deleting, setDeleting] = useState(false);

	const { remove } = useProject();
	const navigate = useNavigate();
	function deleteProject(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		remove.mutate(project.id, {
			onSuccess: () => {
				setDeleting(false);
				navigate("/");
			},
		});
		setDeleting(false);
	}

	return (
		<a href={`?slug=${project.slug}`} key={project.id}>
			<div
				className={clsx(
					"min-w-55 w-full cursor-pointer pl-2 py-1 overflow-hidden rounded-md relative hover:bg-neutral-2 dark:hover:bg-neutral-8",
					{},
				)}
			>
				<div className="w-full group relative flex items-center justify-between gap-1">
					<div className="full items-center gap-1 flex">
						<div
							className={clsx(" size-4.5", {
								"i-solar-sticker-square-bold-duotone": !deleting,
								"i-lucide-trash-2 text-red": deleting,
							})}
						/>
						<div>{deleting ? "Delete?" : project.name}</div>
					</div>
					<div
						className={clsx("hidden group-hover:flex items-center gap-2 mr-2", {
							flex: deleting,
						})}
					>
						{deleting ? (
							<>
								<button
									onClick={deleteProject}
									type="button"
									className="h-full w-full bg-transparent"
								>
									<div className="i-lucide-check text-red" />
								</button>
								<button
									onClick={(e) => {
										e.preventDefault();
										setDeleting(false);
									}}
									type="button"
									className="h-full w-full bg-transparent"
								>
									<div className="i-lucide-x text-green" />
								</button>
							</>
						) : (
							<>
								<a className="h-full w-full" href={`/project/new?slug=${project.slug}`}>
									<div className="i-lucide-pencil" />
								</a>
								<button
									onClick={(e) => {
										setTimeout(() => setDeleting(true), 100);
										e.preventDefault();
									}}
									type="submit"
									className="h-full w-full bg-transparent"
								>
									<div className="i-lucide-x text-red" />
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</a>
	);
}
