import type { TUser } from "./auth";
import type { z } from "zod";
import type { createArticleSchema } from "@/lib/schemas/article";

export type TCreateArticleForm = z.infer<typeof createArticleSchema>;

export enum ArticleType {
	ANALYTICS = "ANALYTICS",
	NEWS = "NEWS",
	OTHER = "OTHER",
}

export const ARTICLE_TYPE_LABELS: Record<ArticleType, string> = {
	[ArticleType.ANALYTICS]: "Agentic Analytics",
	[ArticleType.NEWS]: "Artificial Intelligence",
	[ArticleType.OTHER]: "Other",
} as const;

export type TArticle = {
	id: number;
	title: string;
	content: string;
	previewImage: string;
	type: ArticleType;
	createdAt: Date;
	authorId: number;
	author: Pick<TUser, "name" | "surname">;
};
