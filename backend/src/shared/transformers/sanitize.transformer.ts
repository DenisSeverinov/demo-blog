import { Transform } from "class-transformer";
import sanitizeHtml from "sanitize-html";

export function SanitizeContent() {
	return Transform(({ value }) => {
		if (!value || typeof value !== "string") {
			return value;
		}

		return sanitizeHtml(value);
	});
}
