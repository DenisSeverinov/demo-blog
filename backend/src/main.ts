import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { MainExceptionFilter } from "./shared/filters/main-exception.filter";
import { PrismaClientKnownExceptionFilter } from "./shared/filters/prisma-exception.filters";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix(process.env.API_PREFIX || "/api/v1");
	app.use(cookieParser());
	const { httpAdapter } = app.get(HttpAdapterHost);

	app.useGlobalFilters(
		new MainExceptionFilter(),
		new PrismaClientKnownExceptionFilter(httpAdapter),
	);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	await app.listen(process.env.SERVER_PORT || 8080);
}
bootstrap();
