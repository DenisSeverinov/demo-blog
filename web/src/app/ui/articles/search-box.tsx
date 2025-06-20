"use client";

import { Input } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchBox() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleSearch = useDebouncedCallback((value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value) {
			params.set("query", value);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<Input
			placeholder="Search articles…"
			size="lg"
			onChange={(event) => handleSearch(event.target.value)}
			defaultValue={searchParams.get("query")?.toString()}
		/>
	);
}
