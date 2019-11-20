import { ApiModelProperty } from '@nestjs/swagger';

export class RegisterResponse {
	@ApiModelProperty()
	canLogin: boolean;
	@ApiModelProperty()
	access_token: string;
}
