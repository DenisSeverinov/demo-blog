import type { z } from "zod";
import type { loginSchema } from "@/app/lib/schemas/login/validation";
import type { registerSchema } from "@/app/lib/schemas/register/validation";

export type TLoginForm = z.infer<typeof loginSchema>;
export type TRegisterForm = z.infer<typeof registerSchema>;
