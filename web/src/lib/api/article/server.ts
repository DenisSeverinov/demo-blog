import type { TArticle } from "@/types/article";
import { API_ROOT } from "../constants";
import { getAccessTokenFromCookies } from "../cookies";

export async function getArticlesPreview(query: string): Promise<TArticle[]> {
	const params = new URLSearchParams({
		search: query,
	});

	const accessToken = await getAccessTokenFromCookies();

	const res = await fetch(`${API_ROOT}/articles/preview?${params.toString()}`, {
		headers: accessToken
			? {
					Cookie: `access_token=${accessToken}`,
				}
			: {},
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Failed to fetch articles preview");
	}

	return res.json();
}

export async function getArticleById(id: number): Promise<TArticle> {
	const accessToken = await getAccessTokenFromCookies();
	const res = await fetch(`${API_ROOT}/articles/${id}`, {
		headers: accessToken
			? {
					Cookie: `access_token=${accessToken}`,
				}
			: {},
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Failed to fetch article");
	}

	return res.json();
}
