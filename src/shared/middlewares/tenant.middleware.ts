import { NextFunction, Request, Response } from "express";

import { NestMiddleware, Injectable, ForbiddenException } from "@nestjs/common";

import { headerConstants } from "../../auth/constants/header.constant";
import { AuthService } from "../../auth/auth.service";
import { Tenant } from "../../tenant/tenant.entity";
import { UserRole } from "../../user/user.entity";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
	constructor(private readonly authService: AuthService) {}
	async use(req: Request, res: Response, next: NextFunction) {
		let jwtFromHeader = req.header(headerConstants.authorizationKey);
		if (jwtFromHeader) {
			const jwt = jwtFromHeader.split(" ")[1];
			const { tenant, roles } = await this.authService.decodeJwt(jwt);

			if (roles.includes(UserRole.HOST)) return next();
			const tenantRec = await Tenant.getModel().findById(tenant);
			if (!tenantRec || tenantRec.isDeleted || !tenantRec.isActive) {
				throw new ForbiddenException();
			}
		}
		next();
	}
}
