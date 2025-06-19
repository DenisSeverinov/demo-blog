import { getArticleById } from "@/app/lib/api/article";
import { Article } from "@/app/ui/articles/article";
import dayjs from "dayjs";

type TArticlePageProps = { params: Promise<{ id: string }> };

export default async function ArticlePage({ params }: TArticlePageProps) {
	const { id } = await params;
	const article = await getArticleById(Number(id));

	const articleWithFormattedDate = {
		...article,
		createdAtFormatted: dayjs(article.createdAt).format("MMMM D, YYYY"),
	};

	return <Article article={articleWithFormattedDate} />;
}
