import type { Metadata } from "next";
import { ArticleList } from "@/app/ui/articles/list";
import { getArticlesPreview } from "@/app/lib/api/article";
import type { TArticle } from "@/types/article";
import { Box, Heading } from "@chakra-ui/react";
import { SearchBox } from "../ui/articles/search-box";

export const metadata: Metadata = {
	title: "Articles | Demo Blog",
	description: "List of all articles in the blog",
};

export default async function ArticlesPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q } = await searchParams;
	const query = q ?? "";
	const articles: TArticle[] = await getArticlesPreview(query);

	return (
		<Box as="section" flex={1} py={8} px={{ base: 4, md: 8, lg: 24 }}>
			<Box mb={6}>
				<Heading as="h1" size="2xl" mb={6} textAlign="center">
					Latest news and insights
				</Heading>

				<SearchBox />
			</Box>

			<ArticleList articles={articles} />
		</Box>
	);
}
