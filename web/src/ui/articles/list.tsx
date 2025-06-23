import { Box, SimpleGrid } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { ArticleCard } from "./card";
import { EmptyList } from "../empty-list";
import { getArticlesPreview } from "@/lib/api/article/server";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/constants/date";

type TArticleListProps = { query: string };

export const ArticleList = async ({ query }: TArticleListProps) => {
	const articles = await getArticlesPreview(query);

	if (articles.length === 0) {
		return (
			<Box>
				<EmptyList
					icon={<LuSearch />}
					title="No articles found"
					description="Try to search for something else"
				/>
			</Box>
		);
	}

	return (
		<SimpleGrid columns={{ sm: 2, xl: 3 }} gap={{ base: 8, md: 10 }}>
			{articles.map((article) => {
				const articleWithFormattedDate = {
					...article,
					createdAtFormatted: dayjs(article.createdAt).format(DATE_FORMAT),
				};

				return (
					<ArticleCard key={article.id} article={articleWithFormattedDate} />
				);
			})}
		</SimpleGrid>
	);
};
