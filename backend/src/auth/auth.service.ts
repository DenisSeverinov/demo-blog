import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/auth.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async register({ email, password, role, name, surname }: RegisterDto) {
		const hashed = await bcrypt.hash(password, 10);

		const user = await this.prismaService.user.create({
			data: { email, password: hashed, role, name, surname },
		});

		const { access, refresh } = await this.signTokens(user.id);

		return { access, refresh };
	}

	async login(email: string, password: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const { access, refresh } = await this.signTokens(user.id);

		return { access, refresh };
	}

	async signTokens(userId: number) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			include: { articles: true },
		});

		const payload = {
			id: userId,
			name: user.name,
			surname: user.surname,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
			articles: user.articles,
		};

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
