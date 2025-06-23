import Header from "@/ui/header/header.server";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Box>
			<Header />
			<Box className="container" as="main">
				{children}
			</Box>
		</Box>
	);
}
