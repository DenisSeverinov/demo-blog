import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const PUBLIC_PATHS = new Set<string>(["/login", "/register"]);
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

const isAccessValid = async (token?: string): Promise<boolean> => {
	if (!token) return false;
	try {
		await jwtVerify<JWTPayload>(token, JWT_SECRET);
		return true;
	} catch {
		return false;
	}
};

const tryRefresh = async (
	origin: string,
	refreshToken: string,
): Promise<string[] | null> => {
	const resp = await fetch(`${origin}/api/v1/auth/refresh`, {
		method: "POST",
		headers: { cookie: `${REFRESH_COOKIE}=${refreshToken}` },
	});

	if (!resp.ok) return null;
	const header = resp.headers.get("set-cookie");
	if (!header) return null;

	return header.split(/,(?=\s*\w+=)/);
};

const attachCookies = (cookies: string[]): NextResponse => {
	const res = NextResponse.next();
	for (const cookie of cookies) res.headers.append("Set-Cookie", cookie);
	return res;
};

const isPublicPath = (path: string) => PUBLIC_PATHS.has(path);

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;

	if (await isAccessValid(accessToken)) {
		if (pathname === "/") {
			return NextResponse.redirect(new URL("/articles", req.url));
		}
		return isPublicPath(pathname)
			? NextResponse.redirect(new URL("/articles", req.url))
			: NextResponse.next();
	}

	const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

	if (refreshToken) {
		try {
			const cookies = await tryRefresh(req.nextUrl.origin, refreshToken);
			if (cookies) return attachCookies(cookies);
		} catch (err) {
			console.error("[middleware] refresh error:", err);
		}
	}

	return isPublicPath(pathname)
		? NextResponse.next()
		: NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon\\.ico|assets|api/).*)"],
};
