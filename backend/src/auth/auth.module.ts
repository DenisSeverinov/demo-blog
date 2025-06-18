import { Global, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshJwtStrategy } from "./strategies/refresh-jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";

@Global()
@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_ACCESS_SECRET"),
				signOptions: {
					expiresIn: `${configService.get<number>(
						"JWT_ACCESS_EXPIRES_IN_MIN",
						15,
					)}m`,
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, RefreshJwtStrategy, PrismaService],
	exports: [AuthService],
})
export class AuthModule {}
