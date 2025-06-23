import { cookies } from "next/headers";

export async function getAccessTokenFromCookies() {
	const cookieStore = await cookies();
	return cookieStore.get("access_token")?.value;
}
