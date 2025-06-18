import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

function refreshCookieExtractor(req: Request) {
	return req.cookies?.refresh_token || null;
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	"jwt-refresh",
) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: refreshCookieExtractor,
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("JWT_REFRESH_SECRET"),
		});
	}

	validate(payload: { sub: number }) {
		return { userId: payload.sub };
	}
}
