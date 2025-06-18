"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@chakra-ui/react";
import FormInput from "@/app/ui/auth/form-input";
import FormSelect from "@/app/ui/auth/form-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/app/lib/schemas/register/validation";
import type { TRegisterForm } from "@/app/types/auth";
import { register as registerApi } from "@/app/lib/api/auth";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { toaster } from "@/app/ui/toaster";

export default function RegisterForm() {
	const router = useRouter();
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<TRegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit: SubmitHandler<TRegisterForm> = async (values) => {
		try {
			await registerApi(values);
			router.push("/");
		} catch (error) {
			toaster.create({
				title: (error as Error).message ?? "Invalid credentials",
				type: "error",
			});
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			<FormInput<TRegisterForm>
				label="Email"
				name="email"
				type="email"
				placeholder="you@example.com"
				register={register}
				error={errors.email}
			/>
			<FormInput<TRegisterForm>
				label="Password"
				name="password"
				type="password"
				placeholder="••••••••"
				register={register}
				error={errors.password}
			/>
			<FormSelect<TRegisterForm>
				label="Role"
				name="role"
				register={register}
				options={[
					{ value: "author", label: "Author" },
					{ value: "reader", label: "Reader" },
				]}
				error={errors.role}
			/>
			<Button
				mt={2}
				colorScheme="teal"
				loading={isSubmitting}
				type="submit"
				w="full"
			>
				Sign up
			</Button>
		</form>
	);
}
