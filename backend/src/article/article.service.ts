import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";

@Injectable()
export class ArticleService {
	constructor(private readonly PrismaService: PrismaService) {}
	create(
		createArticleDto: CreateArticleDto & { previewImage: string },
		userId: number,
	) {
		return this.PrismaService.article.create({
			data: {
				...createArticleDto,
				authorId: userId,
			},
		});
	}

	findAll() {
		return this.PrismaService.article.findMany({
			include: {
				author: {
					select: {
						name: true,
						surname: true,
					},
				},
			},
		});
	}

	async findAllPreview(search: string) {
		const articles = await this.PrismaService.article.findMany({
			where: {
				OR: [{ title: { contains: search, mode: "insensitive" } }],
			},
			include: {
				author: {
					select: {
						name: true,
						surname: true,
					},
				},
			},
		});
		return articles.map((article) => ({
			...article,
			content: this.truncateContent(article.content, 100),
		}));
	}

	findOne(id: number) {
		return this.PrismaService.article.findUnique({
			where: { id },
			include: {
				author: {
					select: {
						name: true,
						surname: true,
					},
				},
			},
		});
	}

	private stripMarkdown(md: string): string {
		return (
			md
				// 1. Многострочный код ``` ``` – убираем полностью
				.replace(/```[\s\S]*?```/g, "")
				// 2. Однострочный `code`
				.replace(/`[^`]*`/g, "")
				// 3. Изображения ![alt](url) – удаляем
				.replace(/!\[[^\]]*]\([^)]*\)/g, "")
				// 4. Ссылки [text](url) → сохраняем только text
				.replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
				// 5. Заголовки ##, ###, … и quote >
				.replace(/^\s{0,3}(#{1,6}|>+)\s+/gm, "")
				// 6. Маркеры списков (-, *, +, 1.) в начале строки
				.replace(/^\s*([-+*]|\d+\.)\s+/gm, "")
				// 7. Эмфазы **bold**, *italic*, ~~del~~, __bold__ …
				.replace(/[*_~`]+/g, "")
				// 8. Сдвоенные пробелы и переводы строк → один пробел
				.replace(/\s{2,}/g, " ")
				.trim()
		);
	}

	private truncateContent(content: string, maxLength = 160): string {
		const clean = this.stripMarkdown(content);

		return clean.length <= maxLength
			? clean
			: `${clean.slice(0, maxLength).trimEnd()}…`;
	}
}
