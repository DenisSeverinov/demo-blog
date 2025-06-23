import { Heading, Text, Box, Code, List } from "@chakra-ui/react";

interface MarkdownHeadingProps {
	children?: React.ReactNode;
	className?: string;
}

interface MarkdownParagraphProps {
	children?: React.ReactNode;
	className?: string;
}

interface MarkdownListProps {
	children?: React.ReactNode;
	className?: string;
}

interface MarkdownListItemProps {
	children?: React.ReactNode;
	className?: string;
}

interface MarkdownPreProps {
	children?: React.ReactNode;
	className?: string;
}

interface MarkdownCodeProps {
	children?: React.ReactNode;
	className?: string;
	inline?: boolean;
}

export const markdownComponents = {
	h1: (props: MarkdownHeadingProps) => {
		return <Heading as="h1" size="2xl" my={4} {...props} />;
	},
	h2: (props: MarkdownHeadingProps) => {
		return <Heading as="h2" size="xl" my={3} {...props} />;
	},
	h3: (props: MarkdownHeadingProps) => {
		return <Heading as="h3" size="lg" my={2} {...props} />;
	},
	p: (props: MarkdownParagraphProps) => {
		return (
			<Text mb={3} fontSize={"16px"} lineHeight="1.6">
				{props.children}
			</Text>
		);
	},
	ul: (props: MarkdownListProps) => {
		return <List.Root as="ul" mb={3} pl={6} {...props} />;
	},
	ol: (props: MarkdownListProps) => {
		return <List.Root as="ol" mb={3} pl={6} {...props} />;
	},
	li: (props: MarkdownListItemProps) => {
		return <List.Item fontSize={"16px"} mb={1} {...props} />;
	},
	hr: () => {
		return (
			<Box
				as="hr"
				border="none"
				borderTop="1px solid"
				borderColor="gray.200"
				my={6}
			/>
		);
	},
	pre: (props: MarkdownPreProps) => {
		return (
			<Box
				as="pre"
				bg="gray.50"
				p={4}
				borderRadius="md"
				overflowX="auto"
				my={4}
				fontSize="14px"
				fontFamily="mono"
				{...props}
			/>
		);
	},
	code: (props: MarkdownCodeProps) => {
		const { inline, ...rest } = props;
		if (inline) {
			return <Code fontSize="14px" px={1} py={0.5} {...rest} />;
		}
		return <Box as="code" {...rest} />;
	},
};
