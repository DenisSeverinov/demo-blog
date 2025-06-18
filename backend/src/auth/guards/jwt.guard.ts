import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthException } from "../exceptions/auth.exception";

export interface JwtUser {
	userId: number;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	override handleRequest<TUser = JwtUser>(
		err: unknown,
		user: unknown,
		_info: unknown,
		_ctx: ExecutionContext,
		_status?: unknown,
	): TUser {
		if (!user) throw new AuthException();
		if (err instanceof Error) throw err;
		return user as TUser;
	}
}
