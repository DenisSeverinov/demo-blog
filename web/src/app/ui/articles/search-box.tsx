"use client";

import { Input } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export function SearchBox() {
	const router = useRouter();
	const params = useSearchParams();
	const current = params.get("q") ?? "";
	const timer = useRef<NodeJS.Timeout | null>(null);

	const handleChange = useCallback(
		(v: string) => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
			timer.current = setTimeout(() => {
				const url = v ? `?q=${encodeURIComponent(v)}` : "/";
				router.replace(url); // ⬅️  навигация без полной перезагрузки
			}, 300);
		},
		[router],
	);

	return (
		<Input
			placeholder="Search articles…"
			size="lg"
			defaultValue={current}
			onChange={(e) => handleChange(e.target.value)}
		/>
	);
}
