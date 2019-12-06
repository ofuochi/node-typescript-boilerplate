import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponse {
	@ApiProperty()
	canLogin: boolean;
	@ApiProperty()
	access_token: string;
}
