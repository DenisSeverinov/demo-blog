import { Exclude } from "class-transformer";

export class UserResponseDto {
	id: number;
	email: string;
	role: "user" | "admin";

	@Exclude()
	password: string;
}
