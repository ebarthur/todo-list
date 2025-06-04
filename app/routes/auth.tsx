import clsx from "clsx";
import { tryit } from "radashi";
import { type FieldValues, useForm } from "react-hook-form";
import {
	type ActionFunctionArgs,
	Link,
	type LoaderFunctionArgs,
	type MetaFunction,
	redirect,
	useActionData,
	useLoaderData,
	useSubmit,
} from "react-router";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { admit, createAccount, login } from "~/lib/auth";
import { checkAuth } from "~/lib/check-auth";
import { USERNAME_REGEX } from "~/lib/constants";
import { prisma } from "~/lib/prisma.server";
import { badRequest } from "~/lib/responses";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const invite = url.searchParams.get("invite");

	const [_, user] = await tryit(checkAuth)(request);

	if (user) {
		const user = await checkAuth(request);

		if (invite) {
			return await admit(user, invite);
		}

		return redirect("/");
	}

	const userCreated = await prisma.user.count();

	let mode: "login" | "signup" = "login";

	if (userCreated === 0) {
		mode = "signup";
	} else if (invite) {
		const valid = await prisma.inviteToken.findFirst({
			where: {
				token: invite,
				used: false,
				expiresAt: { gt: new Date() },
			},
		});

		if (!valid) {
			throw badRequest({ detail: "Invalid or expired invite token" });
		}

		const override = url.searchParams.get("login") === "1";

		mode = override ? "login" : "signup";
	}

	const overrideLink = new URL(request.url);

	const isLoginOverride = overrideLink.searchParams.has("login");
	if (isLoginOverride) {
		overrideLink.searchParams.delete("login");
	} else {
		overrideLink.searchParams.set("login", "1");
	}

	return { userCreated, mode, invite, overrideLink };
}

export async function action({ request }: ActionFunctionArgs) {
	const url = new URL(request.url);

	const invite = url.searchParams.get("invite");

	const formData = await request.json();
	const { username, password } = formData;

	if (!username || !password) {
		return badRequest({ detail: "Username and password are required" });
	}

	const userCreated = await prisma.user.count();

	if (userCreated === 0) {
		return createAccount(username, password, invite);
	}

	if (invite) {
		const shouldLogin = url.searchParams.get("login") === "1";

		if (shouldLogin) {
			return login(username, password, invite);
		}

		return createAccount(username, password, invite);
	}

	return login(username, password);
}

export const meta: MetaFunction = () => {
	return [{ title: "Login" }];
};

export default function Login() {
	const { userCreated, mode, invite, overrideLink } =
		useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const { register, handleSubmit, watch, reset } = useForm();
	const submit = useSubmit();

	const $password = watch("password")?.length || 0;

	const $username = watch("username") || "";

	const isUsernameValid = USERNAME_REGEX.test($username);

	function onSubmit(data: FieldValues) {
		submit(JSON.stringify(data), {
			method: "POST",
			encType: "application/json",
		});
	}

	const showOverride = invite;

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="w-74 rounded-lg border border-gray-200 bg-stone-50 dark:(bg-neutral-900 border-neutral-800) shadow-lg -mt-10rem">
				<div className="p-4">
					<h1 className="font-medium">
						{userCreated === 0
							? "Create Super User"
							: mode === "signup"
								? "Sign Up"
								: "Login"}
					</h1>
					<p className="text-sm text-gray-500 mb-2">
						{userCreated === 0
							? "This is a first-time setup. Create a super user account."
							: mode === "signup"
								? "Enter a username and password to create your account."
								: "Enter your username and password to log in."}
					</p>
					{actionData?.detail && (
						<p className="text-sm text-rose-500 mb-2">{actionData.detail}</p>
					)}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
						<div className="relative">
							<Input
								maxLength={14}
								placeholder="username"
								className="font-mono pr-8"
								{...register("username", {
									required: true,
									pattern: USERNAME_REGEX,
								})}
							/>
							{(userCreated === 0 || mode === "signup") && $username && (
								<span
									className={clsx(
										"absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-fade-in animate-duration-200 ",
										isUsernameValid ? "bg-green-600" : "bg-red-600",
									)}
									aria-hidden="true"
								/>
							)}
						</div>

						<div className="relative">
							<Input
								type={
									userCreated === 0 || mode === "signup" ? "text" : "password"
								}
								placeholder="password"
								className="font-mono pr-8"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
								})}
							/>
							{(userCreated === 0 || mode === "signup") && (
								<span
									className={`
					absolute right-2 top-1/2 -translate-y-1/2
					w-2 h-2 rounded-full
					${$password >= 8 ? "bg-green-600" : "dark:bg-neutral-700 bg-neutral-400"}
					`}
									aria-hidden="true"
								/>
							)}
						</div>

						<div>
							<Button className="gap-1" type="submit">
								{mode === "signup" ? "Sign Up" : "Login"}
								<div
									className={clsx({
										"i-lucide-crown": userCreated === 0,
										"i-lucide-corner-down-left": mode === "signup",
									})}
								/>
							</Button>
						</div>

						{showOverride && (
							<div className="mt-1">
								<Link
									to={overrideLink.toString()}
									className="text-sm text-blue-500 underline"
								>
									{mode === "signup"
										? "Already have an account"
										: "I'm new here"}
								</Link>
							</div>
						)}
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
