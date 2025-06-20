import {
	IsString,
	IsEnum,
	IsNotEmpty,
	MinLength,
	MaxLength,
} from "class-validator";
import { ArticleType } from "@prisma/client";

export class CreateArticleDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(200)
	title: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	content: string;

	@IsEnum(ArticleType)
	type: ArticleType;
}
