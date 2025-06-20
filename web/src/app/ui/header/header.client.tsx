"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Flex, Button } from "@chakra-ui/react";
import { UserRole, type JwtPayload } from "@/types/auth";
import { logout } from "@/app/lib/api/auth";
import { useRouter } from "next/navigation";
import { toaster } from "@/app/ui/toaster";
import { ArticleModal } from "@/app/ui/articles/modal";

type THeaderClientProps = { user: JwtPayload | null };

export const HeaderClient = ({ user }: THeaderClientProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout();
			router.push("/login");
		} catch (error) {
			toaster.create({
				title: (error as Error).message ?? "Logout failed",
				type: "error",
			});
		}
	};

	return (
		<>
			<Box
				as="header"
				position="fixed"
				top={0}
				left={0}
				w="100%"
				h="var(--header-height)"
				bg="gray.100"
				zIndex={1000}
				boxShadow="sm"
			>
				<Flex align="center" justify="space-between" h="full" px={8}>
					<Link href="/articles">
						<Flex align="center" gap={2} cursor="pointer">
							<Image
								src="/logo.svg"
								alt="Demo Blog logo"
								width={32}
								height={32}
								priority
							/>
							<Box fontSize="lg" fontWeight="bold" display="flex" gap={1}>
								<Box as="span">demo</Box>
								<Box
									as="span"
									color="gray.400"
									_hover={{ color: "gray.700" }}
									transition="color 0.2s ease"
								>
									blog
								</Box>
							</Box>
						</Flex>
					</Link>

					<Flex gap={4}>
						{user?.role === UserRole.AUTHOR && (
							<Button colorScheme="teal" onClick={() => setIsOpen(true)}>
								Create Article
							</Button>
						)}

						<Button variant="surface" onClick={handleLogout}>
							Logout
						</Button>
					</Flex>
				</Flex>

				<ArticleModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
			</Box>
		</>
	);
};
