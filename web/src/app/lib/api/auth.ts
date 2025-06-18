import type { TLoginForm } from "@/app/types/auth";
import type { TRegisterForm } from "@/app/types/auth";

const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/v1";

export async function login(data: TLoginForm) {
	const res = await fetch(`${API_PREFIX}/auth/login`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Login failed");
	}

	return res.json();
}

export async function register(data: TRegisterForm) {
	const res = await fetch(`${API_PREFIX}/auth/register`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Register failed");
	}

	return res.json();
}
