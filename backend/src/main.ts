import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { MainExceptionFilter } from "./shared/filters/main-exception.filter";
import { PrismaClientExceptionFilter } from "./shared/filters/prisma-exception.filters";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("api/v1");
	app.use(cookieParser());
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(
		new MainExceptionFilter(),
		new PrismaClientExceptionFilter(httpAdapter),
	);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	await app.listen(process.env.SERVER_PORT || 8080);
}
bootstrap();
