import {
	type QueryFunctionContext,
	useInfiniteQuery,
	useMutation,
} from "@tanstack/react-query";
import { useParams, useRevalidator } from "react-router";

export function useNotifications() {
	const { revalidate } = useRevalidator();
	const params = useParams();

	const query = useInfiniteQuery({
		queryKey: ["notifications", params.project],
		getNextPageParam: (lastPage, pages) =>
			lastPage.length > 0 ? pages.length : undefined,
		initialPageParam: 0,
		queryFn: fetchNotifications,
	});

	const read = useMutation({
		mutationFn: readNotifications,
		onSuccess: async () => {
			await Promise.all([revalidate(), query.refetch()]);
		},
	});

	return { query, read };
}

async function fetchNotifications({
	pageParam = 0,
	queryKey,
}: QueryFunctionContext<readonly [string, projectSlug?: string]>) {
	const [, projectSlug] = queryKey;
	const res = await fetch(
		`/notifications?page=${pageParam}&project=${projectSlug}`,
	);
	const { notifications } = await res.json();

	return notifications;
}

async function readNotifications(id: number) {
	const res = await fetch(`/notifications/${id}/read`);

	return res.json();
}
