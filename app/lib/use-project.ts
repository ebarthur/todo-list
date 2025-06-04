import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRevalidator } from "react-router";
import type { Project } from "./types";

export function useProject() {
    const queryClient = useQueryClient();
    const { revalidate } = useRevalidator();

    const projectQuery = useQuery<Project[]>({
        queryKey: ["project", "tasks"] as const,
        queryFn: fetchProjects
    });

    const create = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project"] });

            revalidate();
        },
    });

    const update = useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project"] });

            revalidate();
        },
    });

    const remove = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project"] });

            revalidate();
        },
    });

    return { query: projectQuery, create, update, remove };
}


export async function fetchProjects() {
    const res = await fetch("/project");
    const data = await res.json();
    return data.projects;
}

export async function createProject(project: Partial<Project>): Promise<Project[]> {
    const res = await fetch("/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });

    const data = await res.json();

    return data.project;
}

export async function updateProject(project: Partial<Project>): Promise<Project[]> {
    const res = await fetch("/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
    });

    const data = await res.json();

    return data.project;
}

export async function deleteProject(id: number): Promise<Project[]> {
    const res = await fetch("/project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id})
    });

    const data = await res.json();

    return data.project;
}