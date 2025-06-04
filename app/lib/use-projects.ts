import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRevalidator } from "react-router";
import type { ProjectWithTaskCount } from "./types";

export function useProjects() {
	const queryClient = useQueryClient();
	const { revalidate } = useRevalidator();

	const projectQuery = useQuery<ProjectWithTaskCount[]>({
		queryKey: ["projects"],
		queryFn: fetchProjects,
	});

	const create = useMutation({
		mutationFn: createProject,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["projects"] }),
				revalidate(),
			]);
		},
	});

	const update = useMutation({ mutationFn: updateProject });

	const remove = useMutation({ mutationFn: deleteProject });

	return { query: projectQuery, create, update, remove };
}

export async function fetchProjects() {
	const res = await fetch("/projects");
	const data = await res.json();
	return data.projects;
}

export async function createProject(
	project: Partial<ProjectWithTaskCount>,
): Promise<ProjectWithTaskCount[]> {
	const res = await fetch("/projects", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(project),
	});

	const data = await res.json();

	return data.project;
}

export async function updateProject(
	project: Partial<ProjectWithTaskCount>,
): Promise<ProjectWithTaskCount[]> {
	const res = await fetch("/projects", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(project),
	});

	const data = await res.json();

	return data.project;
}

export async function deleteProject(
	id: number,
): Promise<ProjectWithTaskCount[]> {
	const res = await fetch("/projects", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});

	const data = await res.json();

	return data.project;
}
