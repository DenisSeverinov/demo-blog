"use client";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { ArticleCard } from "./card";
import type { TArticle } from "@/types/article";
import { EmptyList } from "../empty-list";
import { LuSearch } from "react-icons/lu";

type TArticleListProps = { articles: TArticle[] };

export const ArticleList = ({ articles }: TArticleListProps) => {
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
		<SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} gap={{ base: 8, md: 10 }}>
			{articles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</SimpleGrid>
	);
};
