import type { Metadata } from "next";
import { Box, Heading } from "@chakra-ui/react";

import { SearchBox } from "../../ui/articles/search-box";
import { ArticleList } from "@/ui/articles/list";
import { Suspense } from "react";
import { ArticlesSkeleton } from "../../ui/articles/skeleton";

export const metadata: Metadata = {
	title: "Articles | Demo Blog",
	description: "List of all articles in the blog",
};

type TArticlesPageProps = {
	searchParams: Promise<{
		query?: string;
	}>;
};

export default async function ArticlesPage({
	searchParams,
}: TArticlesPageProps) {
	const params = await searchParams;
	const query = params?.query || "";

	return (
		<Box as="section" flex={1} py={8} px={{ base: 4, md: 8, lg: 24 }}>
			<Box mb={6}>
				<Heading as="h1" size="2xl" mb={6} textAlign="center">
					Latest news and insights
				</Heading>
				<SearchBox />
			</Box>

			<Suspense key={query} fallback={<ArticlesSkeleton />}>
				<ArticleList query={query} />
			</Suspense>
		</Box>
	);
}
