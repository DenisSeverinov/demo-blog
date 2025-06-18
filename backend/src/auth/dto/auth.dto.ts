import { IsEmail, IsString, MinLength, IsIn } from "class-validator";
import { Trim } from "src/shared/transformers/trim.transformer";

export class RegisterDto {
	@IsEmail()
	@Trim()
	email: string;

	@IsString()
	@MinLength(6)
	@Trim()
	password: string;

	@IsString()
	@IsIn(["reader", "author"])
	role: "reader" | "author";
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
