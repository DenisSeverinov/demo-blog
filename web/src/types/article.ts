import type { TUser } from "./auth";

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
	createdAtFormatted: string;
	authorId: number;
	author: Pick<TUser, "name" | "surname">;
};
