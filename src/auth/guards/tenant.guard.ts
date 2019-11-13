import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { Types } from "mongoose";
import { errors } from "../constants/error.constant";
import { headerConstants } from "../constants/header.constant";
import { Tenant } from "../../tenant/tenant.entity";

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly _isRequired: boolean;
  constructor(isRequired: boolean = true) {
    this._isRequired = isRequired;
  }
  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(request: Request): Promise<boolean> {
    const tenantId = request.header(headerConstants.tenantIdKey);
    if (this._isRequired && !tenantId) {
      throw errors.TENANT_REQUIRED;
    }
    if (tenantId && !Types.ObjectId.isValid(tenantId)) {
      throw errors.INVALID_TENANT;
    }
    if (tenantId) {
      const tenant = await Tenant.getModel().findById(tenantId);
      if (!tenant) {
        throw new UnauthorizedException();
      }
    }
    return true;
  }
}
