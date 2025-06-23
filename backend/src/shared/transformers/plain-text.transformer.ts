import { Transform } from "class-transformer";
import removeMd from "remove-markdown";

export function PlainText(maxLen?: number) {
	return Transform(({ value }) => {
		if (typeof value !== "string") return value;

		const plain = removeMd(value).replace(/\s+/g, " ").trim();

		return typeof maxLen === "number"
			? plain.slice(0, maxLen).trimEnd() + (plain.length > maxLen ? "…" : "")
			: plain;
	});
}
