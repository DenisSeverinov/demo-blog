import type { z } from "zod";
import type { loginSchema } from "@/lib/schemas/login";
import type { registerSchema } from "@/lib/schemas/register";
import type { TArticle } from "./article";

export type TLoginForm = z.infer<typeof loginSchema>;
export type TRegisterForm = z.infer<typeof registerSchema>;

export enum UserRole {
	AUTHOR = "AUTHOR",
	READER = "READER",
}

export type TUser = {
	id: number;
	name: string;
	surname: string;
	email: string;
	role: UserRole;
	createdAt: Date;
	articles?: TArticle[];
};

export type JwtPayload = {
	userId: number;
	role: UserRole;
};
