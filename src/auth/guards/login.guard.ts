import { Request } from "express";

import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";

import { AuthService } from "../auth.service";
import { LoginInput } from "../dto/LoginInput";

@Injectable()
export class LoginGuard implements CanActivate {
	constructor(private readonly _authService: AuthService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request);
	}
	async validateRequest(request: Request): Promise<boolean> {
		const { emailOrUsername, password }: LoginInput = request.body;
		const user = await this._authService.validateUser(
			emailOrUsername,
			password
		);
		if (!user) throw new UnauthorizedException();
		if (!user.isActive) throw new UnauthorizedException();

		request.user = user;
		return true;
	}
}
