import { z } from "zod";
import { loginSchema } from "./login";
import { UserRole } from "@/types/auth";

export const registerSchema = loginSchema.extend({
	name: z.string().min(1, { message: "Name is required" }),
	surname: z.string().min(1, { message: "Surname is required" }),
	email: z.string().email({ message: "Enter a valid email" }),
	password: z.string().min(6, { message: "Minimum 6 characters" }),
	role: z.enum([UserRole.AUTHOR, UserRole.READER], {
		required_error: "Select role",
	}),
});
