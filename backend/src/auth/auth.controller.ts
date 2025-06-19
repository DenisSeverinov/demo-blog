import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { RefreshJwtGuard } from "./guards/refresh-jwt.guard";
import { ConfigService } from "@nestjs/config";
import { TimeUtils } from "./constants/time.constants";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { User } from "@prisma/client";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	private setCookies(res: Response, access: string, refresh: string) {
		const isProduction = this.configService.get("NODE_ENV") === "production";

		res.cookie("access_token", access, {
			httpOnly: true,
			secure: true,
			sameSite: isProduction ? "lax" : "none",
			maxAge: TimeUtils.minutesToMs(
				this.configService.get<number>("JWT_ACCESS_EXPIRES_IN_MIN", 15),
			),
		});

		res.cookie("refresh_token", refresh, {
			httpOnly: true,
			secure: true,
			sameSite: isProduction ? "strict" : "none",
			maxAge: TimeUtils.daysToMs(
				this.configService.get<number>("JWT_REFRESH_EXPIRES_IN_DAYS", 7),
			),
		});
	}

	@Post("register")
	async register(
		@Body() dto: RegisterDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { access, refresh } = await this.authService.register(dto);
		this.setCookies(res, access, refresh);
		return { success: true };
	}

	@Post("login")
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { access, refresh } = await this.authService.login(
			dto.email,
			dto.password,
		);
		this.setCookies(res, access, refresh);
		return { success: true };
	}

	@Post("refresh")
	@UseGuards(RefreshJwtGuard)
	async refresh(@Res({ passthrough: true }) res: Response) {
		const { access, refresh } = await this.authService.signTokens(
			res.locals.userId,
		);
		this.setCookies(res, access, refresh);
	}

	@Get("me")
	@UseGuards(JwtAuthGuard)
	getMe(@Req() req: { user: User }) {
		return req.user;
	}

	@Post("logout")
	logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie("access_token");
		res.clearCookie("refresh_token");
		return { success: true };
	}
}
