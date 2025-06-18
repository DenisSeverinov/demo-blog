import { Center, Box } from "@chakra-ui/react";

export default function AuthWrapper({
	children,
}: { children: React.ReactNode }) {
	return (
		<Center h="100vh" px={4}>
			<Box
				w={{ base: "100%", sm: "400px" }}
				maxW="sm"
				mx="auto"
				p={6}
				borderWidth={1}
				borderRadius="lg"
				boxShadow="md"
			>
				{children}
			</Box>
		</Center>
	);
}
