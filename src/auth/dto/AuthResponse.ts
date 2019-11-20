import { ApiModelProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiModelProperty()
  access_token: string;
}
