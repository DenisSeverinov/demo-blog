import { API_ROOT } from "./constants";

export async function getArticlesPreview(query: string) {
	const res = await fetch(
		`${API_ROOT}/articles/preview?search=${encodeURIComponent(query)}`,
		{
			next: {
				revalidate: 30,
			},
		},
	);

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Failed to fetch articles preview");
	}

	return res.json();
}

export async function getArticleById(id: number) {
	const res = await fetch(`${API_ROOT}/articles/${id}`, {
		next: {
			revalidate: 60,
		},
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Failed to fetch article");
	}

	return res.json();
}
