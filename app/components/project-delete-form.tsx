import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useRevalidator } from "react-router";
import type { ProjectWithTaskCount } from "~/lib/types";
import { useProjects } from "~/lib/use-projects";
import { Button } from "./button";

interface Props {
	project: ProjectWithTaskCount;
	onClose: () => void;
}

export function ProjectDeleteForm({ project, onClose }: Props) {
	const { remove } = useProjects();
	const params = useParams();

	const navigate = useNavigate();
	const { revalidate } = useRevalidator();
	const queryClient = useQueryClient();

	function deleteProject() {
		remove.mutate(project.id, {
			onSuccess: async () => {
				if (params.project === project.slug) {
					navigate("/");
				}

				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ["projects"] }),
					revalidate(),
				]);

				onClose();
			},
		});
	}

	return (
		<form className="flex flex-col gap-1 p-2">
			<header>
				<h2 className="font-bold">
					Delete <span className="font-mono">{project.name}</span> ?
				</h2>
			</header>

			<div>
				<p className="text-secondary text-sm">
					Are you sure you want to delete this project? All accompanying
					progress will be lost.
				</p>
			</div>

			<div className="flex gap-2">
				<Button
					className="bg-red-500"
					onClick={deleteProject}
					disabled={remove.isPending}
				>
					{remove.isPending ? (
						<div className="i-lucide-loader-circle animate-spin" />
					) : (
						<div className="i-lucide-trash-2" />
					)}
					{remove.isPending ? "Deleting…" : "Delete"}
				</Button>

				<Button
					className="bg-stone-200 !text-stone-800 dark:bg-neutral-800 dark:!text-stone-200"
					onClick={onClose}
					disabled={remove.isPending}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
