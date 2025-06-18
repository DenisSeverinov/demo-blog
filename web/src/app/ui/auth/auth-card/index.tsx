import AuthWrapper from "@/app/ui/auth/auth-wrapper";
import { Heading } from "@chakra-ui/react";
import Link from "next/link";
import styles from "./styles.module.css";
import { Toaster } from "@/app/ui/toaster";

type TAuthCardProps = {
	title: string;
	linkHref: string;
	linkText: string;
	children: React.ReactNode;
};

export default function AuthCard({
	title,
	linkHref,
	linkText,
	children,
}: TAuthCardProps) {
	return (
		<AuthWrapper>
			<Heading mb={6} size="xl" textAlign="center">
				{title}
			</Heading>
			{children}
			<Link href={linkHref} className={styles.switchLink}>
				{linkText}
			</Link>
			<Toaster />
		</AuthWrapper>
	);
}
