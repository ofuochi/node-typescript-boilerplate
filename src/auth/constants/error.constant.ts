import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { headerConstants } from "./header.constant";

export const errors = {
  INVALID_LOGIN_ATTEMPT: new UnauthorizedException("Invalid login attempt!"),
  TENANT_REQUIRED: new BadRequestException(
    `Missing ${headerConstants.tenantIdKey} header!`,
  ),
  INVALID_TENANT: new BadRequestException("Invalid tenant ID!"),
  ACCOUNT_LOCKED_OUT: new UnauthorizedException("Account has been locked out!"),
};
