import { Box, Heading, Input } from "@chakra-ui/react";

export const ArticlesHeader = () => {
	return (
		<Box as="section" py={8} mb={4}>
			<Heading as="h1" size="2xl" mb={6} textAlign="center">
				Latest news and insights
			</Heading>
			<Input placeholder="Search articles..." size="lg" />
		</Box>
	);
};
