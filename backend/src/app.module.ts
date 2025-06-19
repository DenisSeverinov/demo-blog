import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from './article/article.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: "/.env",
		}),
		AuthModule,
		ArticleModule,
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
