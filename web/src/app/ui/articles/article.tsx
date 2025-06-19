"use client";

import {
	AspectRatio,
	Box,
	GridItem,
	Heading,
	Link,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import Image from "next/image";
import type { TArticle } from "@/types/article";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "@/app/lib/markdown";
import remarkGfm from "remark-gfm";

type TArticleProps = { article: TArticle };
export const Article = ({ article }: TArticleProps) => {
	const category = article.type
		.toLowerCase()
		.replace(/^\w/, (c) => c.toUpperCase());

	return (
		<Box as="article" px={{ base: 4, md: 8, lg: 16 }} py={16}>
			<Heading
				as="h1"
				size={{ base: "2xl", md: "3xl", lg: "4xl" }}
				mb={{ base: 10, lg: 16 }}
				lineHeight="1.2"
			>
				{article.title}
			</Heading>
			<SimpleGrid
				columns={{ base: 1, lg: 12 }}
				gap={{ base: 10, lg: 12 }}
				alignItems="start"
			>
				<GridItem colSpan={{ base: 1, lg: 8 }} order={{ base: 2, lg: 1 }}>
					{article.previewImage && (
						<AspectRatio ratio={16 / 9}>
							<Image
								src={article.previewImage}
								alt={article.title}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								priority
								style={{ objectFit: "cover", borderRadius: "1rem" }}
							/>
						</AspectRatio>
					)}
				</GridItem>

				<GridItem
					colSpan={{ base: 1, lg: 4 }}
					as={Stack}
					gap={6}
					order={{ base: 1, lg: 2 }}
				>
					<Stack gap={1}>
						<Text color="gray.600">{article.createdAtFormatted}</Text>
						<Link color="purple.600" fontWeight="medium">
							{category}
						</Link>
					</Stack>

					{/* автор */}
					<Stack direction="row" gap={4} align="center">
						<Box>
							<Text fontWeight="semibold">
								{article.author.name} {article.author.surname}
							</Text>
						</Box>
					</Stack>
				</GridItem>
			</SimpleGrid>
			<Box mt={10}>
				<ReactMarkdown
					components={markdownComponents}
					remarkPlugins={[remarkGfm]}
					skipHtml
				>
					{article.content}
				</ReactMarkdown>
			</Box>
		</Box>
	);
};
