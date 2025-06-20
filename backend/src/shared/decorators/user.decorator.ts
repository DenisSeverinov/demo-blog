import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../../auth/dto/auth.dto";

export const User = createParamDecorator(
	(_, ctx: ExecutionContext): JwtPayload => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);
