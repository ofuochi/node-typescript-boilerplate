import { ApiModelProperty } from "@nestjs/swagger";
import { BaseEntityDto } from "../../base.dto";

export class RegisterResponse extends BaseEntityDto {
  @ApiModelProperty()
  canLogin: boolean;
  @ApiModelProperty()
  access_token: string;
}
