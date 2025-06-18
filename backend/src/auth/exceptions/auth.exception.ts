import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthException extends HttpException {
	constructor(message = "Unauthorized") {
		super(
			{ statusCode: HttpStatus.UNAUTHORIZED, message },
			HttpStatus.UNAUTHORIZED,
		);
	}
}
