import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { LoginInput } from '../dto/LoginInput';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }
  async validateRequest(request: Request): Promise<boolean> {
    const input: LoginInput = request.body;
    const user = await this._authService.validateUser(
      input.emailOrUsername,
      input.password,
    );
    request.user = user;

    if (!user) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
