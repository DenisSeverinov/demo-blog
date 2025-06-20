import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"],
	},
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: `${process.env.API_BASE_URL}:${process.env.API_PORT}/api/v1/:path*`,
			},
		];
	},
};

export default nextConfig;
