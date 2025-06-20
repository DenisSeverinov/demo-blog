import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const CONFIG = {
	COOKIES: {
		ACCESS: "access_token",
		REFRESH: "refresh_token",
	},
	PATHS: {
		PUBLIC: new Set<string>(["/login", "/register"]),
		ARTICLES: "/articles",
		LOGIN: "/login",
		ROOT: "/",
	},
	API: {
		PREFIX: process.env.API_PREFIX || "/api/v1",
		REFRESH_ENDPOINT: "/auth/refresh",
	},
	JWT: {
		SECRET: new TextEncoder().encode(process.env.JWT_ACCESS_SECRET),
	},
} as const;

const validateAccessToken = async (token?: string): Promise<boolean> => {
	if (!token) return false;

	try {
		await jwtVerify<JWTPayload>(token, CONFIG.JWT.SECRET);
		return true;
	} catch {
		return false;
	}
};

const refreshAccessToken = async (
	origin: string,
	refreshToken: string,
): Promise<string[] | null> => {
	const response = await fetch(
		`${origin}${CONFIG.API.PREFIX}${CONFIG.API.REFRESH_ENDPOINT}`,
		{
			method: "POST",
			headers: {
				cookie: `${CONFIG.COOKIES.REFRESH}=${refreshToken}`,
			},
		},
	);

	if (!response.ok) return null;

	const cookieHeader = response.headers.get("set-cookie");

	if (!cookieHeader) return null;

	return cookieHeader.split(/,(?=\s*\w+=)/);
};

const attachCookiesToResponse = (cookies: string[]): NextResponse => {
	const response = NextResponse.next();
	for (const cookie of cookies) {
		response.headers.append("Set-Cookie", cookie);
	}
	return response;
};

const isPublicPath = (path: string): boolean => CONFIG.PATHS.PUBLIC.has(path);

const handleAuthenticatedUser = (
	pathname: string,
	req: NextRequest,
): NextResponse => {
	if (pathname === CONFIG.PATHS.ROOT) {
		return NextResponse.redirect(new URL(CONFIG.PATHS.ARTICLES, req.url));
	}

	return isPublicPath(pathname)
		? NextResponse.redirect(new URL(CONFIG.PATHS.ARTICLES, req.url))
		: NextResponse.next();
};

const attemptTokenRefresh = async (
	req: NextRequest,
	refreshToken: string,
): Promise<NextResponse | null> => {
	try {
		const cookies = await refreshAccessToken(req.nextUrl.origin, refreshToken);
		return cookies ? attachCookiesToResponse(cookies) : null;
	} catch (error) {
		console.error("[middleware] Token refresh failed:", error);
		return null;
	}
};

const handleUnauthenticatedUser = async (
	req: NextRequest,
	pathname: string,
): Promise<NextResponse> => {
	const refreshToken = req.cookies.get(CONFIG.COOKIES.REFRESH)?.value;

	if (refreshToken) {
		const refreshResponse = await attemptTokenRefresh(req, refreshToken);
		if (refreshResponse) return refreshResponse;
	}

	return isPublicPath(pathname)
		? NextResponse.next()
		: NextResponse.redirect(new URL(CONFIG.PATHS.LOGIN, req.url));
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
	const { pathname } = req.nextUrl;
	const accessToken = req.cookies.get(CONFIG.COOKIES.ACCESS)?.value;

	if (await validateAccessToken(accessToken)) {
		return handleAuthenticatedUser(pathname, req);
	}

	return handleUnauthenticatedUser(req, pathname);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon\\.ico|assets|api/).*)"],
};
