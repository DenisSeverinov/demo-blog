import type { Metadata } from "next";
import { Provider } from "@/ui/provider";
import { Roboto } from "next/font/google";

import "./globals.css";

const roboto = Roboto({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-roboto",
});

export const metadata: Metadata = {
	title: "Demo Blog",
	description: "Demo Blog",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${roboto.variable} antialiased`}>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
