"use client";

import {
	FormControl,
	FormErrorMessage,
	FormLabel,
} from "@chakra-ui/form-control";
import { Select, createListCollection } from "@chakra-ui/react";
import { useMemo } from "react";
import type {
	UseFormRegister,
	FieldError,
	FieldValues,
	Path,
} from "react-hook-form";

export type TFormSelectProps<T extends FieldValues> = {
	label: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	options: Array<{ value: string; label: string }>;
	placeholder?: string;
	error?: FieldError;
};

export default function FormSelect<T extends FieldValues>({
	label,
	name,
	register,
	options,
	placeholder = "Select value",
	error,
}: TFormSelectProps<T>) {
	const collection = useMemo(
		() => createListCollection({ items: options }),
		[options],
	);

	return (
		<FormControl isInvalid={!!error} mb={4}>
			<FormLabel htmlFor={name} pb={4}>
				{label}
			</FormLabel>

			<Select.Root collection={collection} size="sm">
				<Select.HiddenSelect {...register(name)} />

				<Select.Control>
					<Select.Trigger>
						<Select.ValueText placeholder={placeholder} />
					</Select.Trigger>
					<Select.IndicatorGroup>
						<Select.Indicator />
					</Select.IndicatorGroup>
				</Select.Control>
				<Select.Positioner zIndex="modal">
					<Select.Content>
						{collection.items.map((item) => (
							<Select.Item item={item} key={item.value}>
								{item.label}
								<Select.ItemIndicator />
							</Select.Item>
						))}
					</Select.Content>
				</Select.Positioner>
			</Select.Root>

			<FormErrorMessage fontSize="small" color="red">
				{error?.message}
			</FormErrorMessage>
		</FormControl>
	);
}
