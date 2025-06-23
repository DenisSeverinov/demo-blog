import {
	IsString,
	IsEnum,
	IsNotEmpty,
	MinLength,
	MaxLength,
} from "class-validator";
import { ArticleType } from "@prisma/client";
import { SanitizeContent } from "src/shared/transformers/sanitize.transformer";

export class CreateArticleDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(200)
	title: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	@SanitizeContent()
	content: string;

	@IsEnum(ArticleType)
	type: ArticleType;
}
