"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@chakra-ui/react";
import FormInput from "@/app/ui/auth/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/lib/schemas/login/validation";
import type { TLoginForm } from "@/types/auth";
import styles from "./styles.module.css";
import { login } from "@/app/lib/api/auth";
import { useRouter } from "next/navigation";
import { toaster } from "@/app/ui/toaster";

export const LoginForm = () => {
	const router = useRouter();
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<TLoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<TLoginForm> = async (values) => {
		try {
			await login(values);
			router.push("/articles");
		} catch (error) {
			toaster.create({
				title: (error as Error).message ?? "Invalid credentials",
				type: "error",
			});
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
			<FormInput<TLoginForm>
				label="Email"
				name="email"
				type="email"
				placeholder="you@example.com"
				register={register}
				error={errors.email}
			/>
			<FormInput<TLoginForm>
				label="Password"
				name="password"
				type="password"
				placeholder="••••••••"
				register={register}
				error={errors.password}
			/>
			<Button
				mt={2}
				colorScheme="teal"
				loading={isSubmitting}
				type="submit"
				w="full"
			>
				Sign in
			</Button>
		</form>
	);
};
