"use client";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function ArticleError({
	error,
}: {
	error: Error & { digest?: string };
}) {
	const router = useRouter();

	return (
		<Box
			minH="calc(100vh - var(--header-height))"
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
			gap={6}
		>
			<Heading as="h2" size="lg" textAlign="center">
				Failed to load article
			</Heading>
			<Text color="gray.500" textAlign="center">
				{error.message}
			</Text>
			<Button
				colorScheme="red"
				onClick={() => router.push("/articles")}
				size="md"
			>
				Return to articles page
			</Button>
		</Box>
	);
}
