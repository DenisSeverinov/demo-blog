import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from "./article/article.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: "/.env",
		}),
		AuthModule,
		ArticleModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "..", "uploads"),
			serveRoot: "/uploads",
		}),
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
