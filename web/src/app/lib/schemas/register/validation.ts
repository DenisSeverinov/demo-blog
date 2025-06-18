import { z } from "zod";
import { loginSchema } from "../login/validation";

export const registerSchema = loginSchema.extend({
	email: z.string().email({ message: "Enter a valid email" }),
	password: z.string().min(6, { message: "Minimum 6 characters" }),
	role: z.enum(["author", "reader"], { required_error: "Select role" }),
});
