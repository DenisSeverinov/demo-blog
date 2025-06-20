"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@chakra-ui/react";
import FormInput from "@/app/ui/form-input";
import FormSelect from "@/app/ui/form-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/app/lib/schemas/register";
import { UserRole, type TRegisterForm } from "@/types/auth";
import { register as registerApi } from "@/app/lib/api/auth";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { toaster } from "@/app/ui/toaster";

const options = [
	{ value: UserRole.AUTHOR, label: "Author" },
	{ value: UserRole.READER, label: "Reader" },
];

export const RegisterForm = () => {
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
			<FormInput<TRegisterForm>
				label="Name"
				name="name"
				type="text"
				placeholder="John"
				register={register}
				error={errors.name}
			/>
			<FormInput<TRegisterForm>
				label="Surname"
				name="surname"
				type="text"
				placeholder="Doe"
				register={register}
				error={errors.surname}
			/>
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
				options={options}
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
};
