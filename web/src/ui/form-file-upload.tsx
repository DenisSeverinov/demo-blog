"use client";

import {
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/form-control";
import { Button, FileUpload } from "@chakra-ui/react";
import type { UseFormRegister, Path, FieldValues } from "react-hook-form";

export type TFormFileUploadProps<T extends FieldValues> = {
	label: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	error?: { message?: string };
	accept?: string;
	maxFiles?: number;
	buttonText?: string;
};

export default function FormFileUpload<T extends FieldValues>({
	label,
	name,
	register,
	error,
	accept,
	maxFiles = 1,
	buttonText = "Select File",
}: TFormFileUploadProps<T>) {
	return (
		<FormControl isInvalid={!!error} mb={4}>
			<FormLabel htmlFor={name} pb={4}>
				{label}
			</FormLabel>
			<FileUpload.Root accept={accept} maxFiles={maxFiles}>
				<FileUpload.HiddenInput {...register(name)} />
				<FileUpload.Trigger asChild>
					<Button variant="outline" size="sm" width="100%">
						{buttonText}
					</Button>
				</FileUpload.Trigger>
				<FileUpload.List />
			</FileUpload.Root>
			<FormErrorMessage fontSize="small" color="red">
				{error?.message}
			</FormErrorMessage>
		</FormControl>
	);
}
