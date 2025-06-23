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

	async findAllPreview(search?: string) {
		const articles = await this.PrismaService.article.findMany({
			where: search
				? {
						OR: [{ title: { contains: search, mode: "insensitive" } }],
					}
				: {},
			include: {
				author: {
					select: {
						name: true,
						surname: true,
					},
				},
			},
		});
		return articles;
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
}
