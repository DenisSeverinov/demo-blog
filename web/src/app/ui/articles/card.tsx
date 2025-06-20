"use client";

import NextLink from "next/link";
import {
	AspectRatio,
	Heading,
	Image,
	LinkBox,
	LinkOverlay,
	Stack,
	Text,
} from "@chakra-ui/react";
import type { TArticle } from "@/types/article";
import { ARTICLE_TYPE_LABELS } from "@/types/article";

type TArticleCardProps = {
	article: TArticle & { createdAtFormatted: string };
};

export const ArticleCard = ({ article }: TArticleCardProps) => (
	<LinkBox
		as="article"
		role="group"
		_hover={{ textDecoration: "none" }}
		transition="all .2s ease"
	>
		<AspectRatio ratio={16 / 9}>
			<Image
				src={article.previewImage}
				alt={article.title}
				objectFit="cover"
				rounded="xl"
				_groupHover={{ transform: "scale(1.03)" }}
				transition="transform .3s ease"
			/>
		</AspectRatio>

		<Stack mt={3} gap={1}>
			<Text fontSize="sm" color="purple.600" fontWeight="medium">
				{ARTICLE_TYPE_LABELS[article.type]}
			</Text>

			<Heading as="h3" size="md" _groupHover={{ color: "purple.700" }}>
				<LinkOverlay as={NextLink} href={`/articles/${article.id}`}>
					{article.title}
				</LinkOverlay>
			</Heading>

			<Text fontSize="small" color="gray.500">
				{article.content}
			</Text>

			<Text fontSize="sm">
				{article.author.name} {article.author.surname} •{" "}
				{article.createdAtFormatted}
			</Text>
		</Stack>
	</LinkBox>
);
