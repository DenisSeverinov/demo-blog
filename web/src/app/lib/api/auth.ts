import type { TLoginForm } from "@/types/auth";
import type { TRegisterForm } from "@/types/auth";
import { API_ROOT } from "./constants";

export async function login(data: TLoginForm) {
	const res = await fetch(`${API_ROOT}/auth/login`, {
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
	const res = await fetch(`${API_ROOT}/auth/register`, {
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

export async function logout() {
	const res = await fetch(`${API_ROOT}/auth/logout`, {
		method: "POST",
		credentials: "include",
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message ?? "Logout failed");
	}

	return res.json();
}
