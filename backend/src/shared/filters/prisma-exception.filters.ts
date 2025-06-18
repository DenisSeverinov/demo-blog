import {
	ArgumentsHost,
	Catch,
	ConflictException,
	NotFoundException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "../../../generated/prisma";
import { ERROR_CODES } from "./constants";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
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
