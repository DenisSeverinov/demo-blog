"use client";

import { SimpleGrid, Skeleton } from "@chakra-ui/react";

export function ArticlesSkeleton() {
	return (
		<SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} gap={{ base: 8, md: 10 }}>
			{Array.from({ length: 6 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<Skeleton key={index} h="320px" borderRadius="xl" />
			))}
		</SimpleGrid>
	);
}
