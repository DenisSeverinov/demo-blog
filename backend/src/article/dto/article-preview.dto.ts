import { PlainText } from "src/shared/transformers/plain-text.transformer";
import { Article, ArticleType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { ResponseDto } from "src/shared/dto/response.dto";

@Exclude()
export class ArticlePreviewDto extends ResponseDto<Article> {
	@Expose()
	id: number;

	@Expose()
	title: string;

	@Expose()
	@PlainText(100)
	content: string;

	@Expose()
	previewImage: string;

	@Expose()
	author: { name: string; surname: string };

	@Expose()
	createdAt: Date;

	@Expose()
	type: ArticleType;
}
