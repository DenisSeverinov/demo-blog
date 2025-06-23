import { DATE_FORMAT } from "@/constants/date";
import { getArticleById } from "@/lib/api/article/server";
import { Article } from "@/ui/articles/article";
import dayjs from "dayjs";

type TArticlePageProps = { params: Promise<{ id: string }> };

export default async function ArticlePage({ params }: TArticlePageProps) {
	const { id } = await params;
	const article = await getArticleById(Number(id));

	const articleWithFormattedDate = {
		...article,
		createdAtFormatted: dayjs(article.createdAt).format(DATE_FORMAT),
	};

	return <Article article={articleWithFormattedDate} />;
}
