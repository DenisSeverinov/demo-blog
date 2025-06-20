import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	ParseIntPipe,
	Query,
	UseInterceptors,
	UploadedFile,
	UseGuards,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";
import { extname } from "node:path";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { User } from "src/shared/decorators/user.decorator";
import { FILE_SIZE_LIMIT } from "./article.constants";
import { JwtPayload } from "src/auth/dto/auth.dto";

@Controller("articles")
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FileInterceptor("previewImage", {
			storage: diskStorage({
				destination: "./uploads",
				filename: (_, file, cb) =>
					cb(null, `${uuid()}${extname(file.originalname)}`),
			}),
			limits: { fileSize: FILE_SIZE_LIMIT },
		}),
	)
	create(
		@Body() dto: CreateArticleDto,
		@User() user: JwtPayload,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.articleService.create(
			{ ...dto, previewImage: `/uploads/${file.filename}` },
			user.userId,
		);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll() {
		return this.articleService.findAll();
	}

	@Get("preview")
	@UseGuards(JwtAuthGuard)
	findAllPreview(@Query("search") search: string) {
		return this.articleService.findAllPreview(search);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.articleService.findOne(id);
	}
}
