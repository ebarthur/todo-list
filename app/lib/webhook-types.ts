import type { Status, Task, User } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export type EventType =
	| "task.created"
	| "task.updated"
	| "task.deleted"
	| "task.status_changed"
	| "task.assigned"
	| "comment.created"
	| "user.joined";

export type WebhookPayload = {
	"task.created": {
		task: Task & { assignee?: SafeUser };
		user?: SafeUser;
	};

	"task.updated": {
		task: Task & { assignee?: SafeUser };
		user?: SafeUser;
		updatedFields: string[];
	};

	"task.deleted": {
		task: Task & { assignee?: SafeUser };
		user?: SafeUser;
	};

	"task.status_changed": {
		task: Task & { assignee?: SafeUser };
		user?: SafeUser;
		previousStatus: Status;
	};

	"task.assigned": {
		task: Task & { assignee?: SafeUser };
		user?: SafeUser;
	};

	"comment.created": {
		task: Task & { assignee?: SafeUser };
		user?: SafeUser;
		comment: string;
	};

	"user.joined": {
		user: SafeUser;
	};
};

export type WebhookEvent<T extends EventType> = {
	type: T;
} & WebhookPayload[T];

export type AnyWebhookEvent = {
	[K in EventType]: WebhookEvent<K>;
}[EventType];
