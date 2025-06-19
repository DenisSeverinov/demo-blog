import { cookies } from "next/headers";
import { type JWTPayload, jwtVerify } from "jose";
import type { TUser } from "@/types/auth";

export async function getUser() {
	const token = (await cookies()).get("access_token")?.value;
	if (!token) return null;

	try {
		const { payload } = await jwtVerify<JWTPayload>(
			token,
			new TextEncoder().encode(process.env.JWT_ACCESS_SECRET),
		);

		const { exp, iat, ...rest } = payload;

		return rest as TUser;
	} catch {
		return null;
	}
}
