import type { TCreateArticleForm } from "@/types/article";
import { API_ROOT } from "../constants";

export async function createArticle(data: TCreateArticleForm) {
	const form = new FormData();
	form.append("title", data.title);
	form.append("type", String(data.type));
	form.append("content", data.content);

	if (data.previewImage?.[0]) {
		form.append("previewImage", data.previewImage[0]);
	}

	const res = await fetch(`${API_ROOT}/articles`, {
		method: "POST",
		body: form,
		credentials: "include",
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Failed to create article");
	}

	return res.json();
}
