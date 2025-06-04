import clsx from "clsx";
import {
	redirect,
	useLoaderData,
	useNavigate,
	type LoaderFunctionArgs,
} from "react-router";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { useProject } from "~/lib/use-project";
import { type SubmitHandler, useForm } from "react-hook-form";
import { SLUG_REGEX } from "~/lib/constants";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	let user: Awaited<ReturnType<typeof checkAuth>>;
	try {
		user = await checkAuth(request);
	} catch (error) {
		return redirect("/login");
	}

	const url = new URL(request.url);
	const slug = url.searchParams.get("slug");
	if (slug) {
		const project = await prisma.project.findFirst({
			where: {
				slug: slug as string,
			},
		});

		return { project, user };
	}

	return { project: null, user };
};

interface IFormInput {
	name: string;
	slug: string;
}

export default function NewPorject() {
	const { user, project } = useLoaderData<typeof loader>();
	const { create, update } = useProject();

	const { register, handleSubmit, watch } = useForm<IFormInput>();
	const $name = watch("name")?.length || 0;

	const $slug = watch("slug") || "";
	const validSlug = SLUG_REGEX.test($slug);
	const navigate = useNavigate();
	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		if (project) {
			update.mutate(
				{
					id: project.id,
					name: data.name,
					slug: data.slug,
				},
				{ onSuccess: () => navigate(`/?slug=${data.slug}`) },
			);
		} else {
			create.mutate(
				{
					name: data.name,
					authorId: user.id,
					slug: data.slug,
				},
				{ onSuccess: () => navigate(`/?slug=${data.slug}`) },
			);
		}
	};

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="w-74 rounded-lg border border-gray-200 bg-stone-50 dark:(bg-neutral-900 border-neutral-800) shadow-lg -mt-10rem">
				<div className="p-4">
					<h1 className="font-medium mb-2">
						{project ? (
							<span>
								Update{" "}
								<span className="font-mono p-.5 px-2 bg-rose/30 rounded-full">
									{project.name}
								</span>
							</span>
						) : (
							"Add New Project"
						)}
					</h1>

					<form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
						<div className="relative">
							<Input
								maxLength={14}
								placeholder="name"
								{...register("name", {
									value: project?.name || "",
									required: true,
								})}
								className="font-mono pr-8"
							/>
							{$name > 0 && (
								<span
									className={clsx(
										"absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-fade-in animate-duration-200 ",
										"bg-green-600",
									)}
									aria-hidden="true"
								/>
							)}
						</div>

						<div className="relative">
							<Input
								type={"text"}
								placeholder="slug"
								className="font-mono pr-8"
								{...register("slug", {
									required: true,
									value: project?.slug || "",
									pattern: SLUG_REGEX,
								})}
							/>
							<span
								className={clsx(
									"absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full",
									validSlug ? "bg-green-600" : "bg-rose-400",
								)}
								aria-hidden="true"
							/>
						</div>

						<Button className="gap-1" type="submit">
							{project ? "Update" : "Create"}
							<div
								className={clsx({
									"i-lucide-plus": project === null,
									"i-lucide-corner-down-left": project?.id,
								})}
							/>
						</Button>
					</form>
				</div>

				<div className="border-t dark:border-neutral-800 bg-stone-200/40 dark:bg-neutral-800/30 px-4 py-2 flex justify-end">
					<a
						href="https://github.com/blackmann/todo-list"
						className="flex items-center gap-1 bg-stone-200 dark:bg-neutral-800 px-2 py-1 rounded-xl text-secondary font-mono text-sm font-medium"
						target="_blank"
						rel="noreferrer"
					>
						<div className="i-lucide-github" /> todo-list
					</a>
				</div>
			</div>
		</div>
	);
}
