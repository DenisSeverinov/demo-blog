import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	ParseIntPipe,
	Query,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";

@Controller("articles")
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post()
	create(@Body() createArticleDto: CreateArticleDto) {
		return this.articleService.create(createArticleDto);
	}

	@Get()
	findAll() {
		return this.articleService.findAll();
	}

	@Get("preview")
	findAllPreview(@Query("search") search: string) {
		return this.articleService.findAllPreview(search);
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.articleService.findOne(id);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.articleService.remove(id);
	}
}
