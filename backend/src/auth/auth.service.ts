import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/auth.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async register({ email, password, role }: RegisterDto) {
		const hashed = await bcrypt.hash(password, 10);

		const user = await this.prismaService.user.create({
			data: { email, password: hashed, role },
		});

		const userDto = plainToInstance(UserResponseDto, user);
		const { access, refresh } = await this.signTokens(user.id);

		return { user: userDto, access, refresh };
	}

	async login(email: string, password: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const userDto = plainToInstance(UserResponseDto, user);
		const { access, refresh } = await this.signTokens(user.id);

		return { user: userDto, access, refresh };
	}

	async signTokens(userId: number) {
		const payload = { sub: userId };

		const [access, refresh] = await Promise.all([
			this.jwtService.signAsync(payload),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
				expiresIn: `${this.configService.get<number>(
					"JWT_REFRESH_EXPIRES_IN_DAYS",
					7,
				)}d`,
			}),
		]);

		return { access, refresh };
	}
}
