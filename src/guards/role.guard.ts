import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../modules/auth/auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }
    if (roles.includes('public')) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];
    if (!token) {
      return false;
    }

    const { group } = this.authService.decodeToken(token);
    if (roles.includes(group)) {
      return true;
    }
    return false;
  }
}
