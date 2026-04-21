import React from "react";
import { useLoaderData } from "react-router";
import { useComments } from "~/lib/use-comments";
import type { loader } from "~/routes/$project";
import { CommentComposer } from "./comment-composer";
import { TaskComment } from "./task-comment";

interface Props {
	opened: boolean;
	taskId: number;
}

export function TaskComments({ opened, taskId }: Props) {
	const { data: comments = [], status } = useComments(taskId, opened);
	const { user } = useLoaderData<typeof loader>();
	const [commentToEditId, setCommentToEditId] = React.useState<number | null>(
		null,
	);

	React.useEffect(() => {
		if (!commentToEditId) return;

		const stillExists = comments.some(
			(comment) => comment.id === commentToEditId,
		);
		if (!stillExists) {
			setCommentToEditId(null);
		}
	}, [comments, commentToEditId]);

	const handleRequestEditLatestComment = React.useCallback(() => {
		const latestOwnComment = [...comments]
			.reverse()
			.find((comment) => comment.authorId === user.id && !comment.deletedAt);

		if (!latestOwnComment) return;

		setCommentToEditId(latestOwnComment.id);
	}, [comments, user.id]);

	if (!opened) return null;

	return (
		<ul className="border-t border-stone-200 dark:border-neutral-700/50">
			{comments.map((comment) => (
				<TaskComment
					key={comment.id}
					taskId={taskId}
					comment={comment}
					isEditing={commentToEditId === comment.id}
					onEditModeChange={(isEditing) => {
						setCommentToEditId(isEditing ? comment.id : null);
					}}
				/>
			))}

			{status === "pending" && (
				<li className="flex justify-center items-center py-2">
					<div className="i-svg-spinners:3-dots-fade" />
				</li>
			)}

			<li>
				<div className="bg-stone-200/60 dark:bg-neutral-800/50 p-2 ps-12">
					<CommentComposer
						taskId={taskId}
						onRequestEditLatestComment={handleRequestEditLatestComment}
					/>
				</div>
			</li>
		</ul>
	);
}
