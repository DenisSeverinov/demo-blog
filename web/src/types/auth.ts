import type { z } from "zod";
import type { loginSchema } from "@/app/lib/schemas/login/validation";
import type { registerSchema } from "@/app/lib/schemas/register/validation";
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
