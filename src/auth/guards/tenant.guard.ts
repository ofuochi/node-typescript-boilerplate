import { Request } from "express";
import { Types } from "mongoose";

import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";

import { Tenant } from "../../tenant/tenant.entity";
import { errors } from "../constants/error.constant";
import { headerConstants } from "../constants/header.constant";

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
			if (!tenant || tenant.isDeleted) throw new UnauthorizedException();
			if (!tenant.isActive)
				throw new UnauthorizedException(
					`Tenant with name ${tenant.name} has been deactivated`
				);
		}
		return true;
	}
}
