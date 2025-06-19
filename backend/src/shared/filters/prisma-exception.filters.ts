import { ERROR_CODES } from "./constants";
import {
	ArgumentsHost,
	Catch,
	ConflictException,
	NotFoundException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownExceptionFilter extends BaseExceptionFilter {
	catch(
		exception: Prisma.PrismaClientKnownRequestError,
		host: ArgumentsHost,
	): void {
		console.error("PrismaClientKnownRequestError", { exception });
		let error: Error = exception;

		switch (exception.code) {
			case ERROR_CODES.RECORD_NOT_FOUND: {
				error = new NotFoundException();
				break;
			}
			case ERROR_CODES.RECORD_CONFLICT:
			case ERROR_CODES.RECORD_CONSTRAINT_FAILED: {
				error = new ConflictException();
				break;
			}
		}

		super.catch(error, host);
	}
}
