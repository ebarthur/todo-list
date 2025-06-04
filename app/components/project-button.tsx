import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useProject } from "~/lib/use-project";
import { ProjectItem } from "./project-item";
import { useLoaderData } from "react-router";
import type { loader } from "~/routes/_index";


export function ProjectButton() {
    const { project_id } = useLoaderData<typeof loader>();
    const { query } = useProject()
    const { data: projects } = query;

    const activeProject = projects?.filter((p) => p.id === Number(project_id))[0]


    return (
        <Popover placement="bottom-end">
            <PopoverTrigger asChild>
                <div className="min-w-20 p-1 pl-2 gap-1 flex items-center">
                    <div className="i-solar-clipboard-list-linear" />
                    {activeProject ?
                        <div className="" key={activeProject.id}>
                            <p>{activeProject.name}</p>
                        </div> : <p>Select Project</p>
                    }
                    <div className="i-solar-alt-arrow-down-linear size-5" />
                </div>
            </PopoverTrigger>

            <PopoverContent className="z-100 text-secondary divide-y divide-neutral-5/50 transition-[width,min-width] duration-300 ease-in-out will-change-width bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800 overflow-hidden shadow-lg mt-1.5">
                <div className="p-2">
                    {projects?.map((project) => (
                        <ProjectItem project={project} key={project.id} />
                    ))}
                </div>
                <div className="w-full p-2 ">
                    <a href="/project/new" className="flex items-center gap-1 p-1 w-full rounded-md bg-neutral-2 hover:bg-neutral-3 dark:bg-neutral-800 dark:hover:bg-neutral-7" type="button">
                        <div className="i-lucide-plus size-5" />
                        Add new project
                    </a>
                </div>
            </PopoverContent>
        </Popover>
    );
}