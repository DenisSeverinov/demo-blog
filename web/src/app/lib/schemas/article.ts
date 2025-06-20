import { ArticleType } from "@/types/article";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

const isFileListAvailable = typeof FileList !== "undefined";

export const createArticleSchema = z.object({
	title: z.string().min(3, { message: "Title is too short" }),
	content: z.string().min(10, { message: "Content is too short" }),
	previewImage: isFileListAvailable
		? z
				.instanceof(FileList)
				.refine((files) => files.length === 1, "Image is required.")
				.refine((files) => {
					const file = files[0];
					return file?.size <= MAX_FILE_SIZE;
				}, "Max image size is 5MB.")
				.refine((files) => {
					const file = files[0];
					return ACCEPTED_IMAGE_TYPES.includes(file?.type);
				}, "Only .jpg, .jpeg, .png and .webp formats are supported.")
		: z.any(),
	type: z.nativeEnum(ArticleType, {
		errorMap: () => ({ message: "Please select a type" }),
	}),
});
