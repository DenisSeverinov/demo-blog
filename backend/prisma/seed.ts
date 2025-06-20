// prisma/seed.ts
import { PrismaClient, UserRole, ArticleType } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";

const prisma = new PrismaClient();
const ARTICLES_DIR = path.join(__dirname, "seed", "articles");

const names = [
	"John",
	"Sarah",
	"Michael",
	"Emma",
	"David",
	"Olivia",
	"James",
	"Sophia",
	"Robert",
	"Ava",
];
const surnames = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Garcia",
	"Miller",
	"Davis",
	"Rodriguez",
	"Martinez",
];

const articleTitles = [
	"Understanding JavaScript Closures: A Deep Dive",
	"A Comprehensive Guide to SQL Window Functions",
	"Deploying Next.js at Scale: Best Practices",
	"Mastering Git Rebase Without Fear",
	"PostgreSQL Index Types Explained: B-tree, GIN, BRIN",
	"Practical CSS Container Queries",
	"JWT Security Best Practices for Modern APIs",
	"10 Bash Tricks That Will Boost Your Productivity",
	"Async/Await Beyond the Basics: Advanced Patterns",
];

async function main() {
	const already = await prisma.article.count();
	if (already > 0) {
		console.log(`▶ Seed skipped – ${already} articles already present`);
		return;
	}

	const emails = ["admin1@gmail.com", "admin2@gmail.com", "admin3@gmail.com"];
	const passwords = await Promise.all(
		emails.map((_, i) => bcrypt.hash(`password${i + 1}`, 10)),
	);
	const authors = await prisma.$transaction(
		emails.map((email, i) =>
			prisma.user.upsert({
				where: { email },
				update: {},
				create: {
					email,
					password: passwords[i],
					role: UserRole.AUTHOR,
					name: names[i % names.length],
					surname: surnames[i % surnames.length],
				},
			}),
		),
	);

	const files = readdirSync(ARTICLES_DIR)
		.filter((f) => f.endsWith(".md"))
		.slice(0, 9);

	let idx = 0;
	for (const file of files) {
		const markdown = readFileSync(path.join(ARTICLES_DIR, file), "utf8");
		const title =
			articleTitles[idx] || markdown.split("\n")[0].replace(/^#\s*/, "");

		const type =
			idx % 3 === 0
				? ArticleType.ANALYTICS
				: idx % 3 === 1
					? ArticleType.NEWS
					: ArticleType.OTHER;

		await prisma.article.create({
			data: {
				title,
				content: markdown,
				previewImage: `/articles/mock-photo-blog-${idx + 1}.webp`,
				type,
				authorId: authors[idx % authors.length].id,
			},
		});
		idx++;
	}

	console.log(`✓ Seeded ${authors.length} users & ${idx} articles`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
