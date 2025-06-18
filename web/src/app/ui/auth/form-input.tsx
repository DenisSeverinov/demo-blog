import {
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import type {
	FieldError,
	UseFormRegister,
	Path,
	FieldValues,
} from "react-hook-form";

export type TFormInputProps<T extends FieldValues> = {
	label: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	type?: string;
	placeholder?: string;
	error?: FieldError;
};

export default function FormInput<T extends FieldValues>({
	label,
	name,
	register,
	type = "text",
	placeholder,
	error,
}: TFormInputProps<T>) {
	return (
		<FormControl isInvalid={!!error} mb={4}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Input
				id={name}
				type={type}
				placeholder={placeholder}
				{...register(name)}
			/>
			<FormErrorMessage fontSize="small" color="red">
				{error?.message}
			</FormErrorMessage>
		</FormControl>
	);
}
