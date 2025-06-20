import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtPayload } from "src/auth/dto/auth.dto";

function cookieExtractor(req: Request) {
	return req.cookies?.access_token || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				cookieExtractor,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("JWT_ACCESS_SECRET"),
		});
	}

	validate(payload: JwtPayload) {
		return payload;
	}
}
