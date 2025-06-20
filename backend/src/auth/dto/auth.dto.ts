import { UserRole } from "@prisma/client";
import { IsEmail, IsString, MinLength, IsIn } from "class-validator";
import { Trim } from "src/shared/transformers/trim.transformer";

export class RegisterDto {
	@IsString()
	@Trim()
	name: string;

	@IsString()
	@Trim()
	surname: string;

	@IsEmail()
	@Trim()
	email: string;

	@IsString()
	@MinLength(6)
	@Trim()
	password: string;

	@IsString()
	@IsIn(Object.values(UserRole))
	role: UserRole;
}

export class LoginDto {
	@IsEmail()
	@Trim()
	email: string;

	@IsString()
	@MinLength(6)
	@Trim()
	password: string;
}

export interface JwtPayload {
	userId: number;
	role: UserRole;
}
