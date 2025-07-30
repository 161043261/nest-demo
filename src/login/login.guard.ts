import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request as ExpressRequest } from 'express';
@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('[loginGuard] Object.keys(context):', Object.keys(context));

    console.log(
      '[loginGuard] context.getHandler():',
      context.getHandler().toString(),
    );

    const roles = this.reflector.get<string[] | undefined>(
      'roles',
      context.getHandler(),
    );
    // roles: ['admin']
    console.log('[loginGuard] roles:', roles);

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<ExpressRequest>();
    const queryRole = req.query.role;

    // req.query.role: admin
    console.log('[loginGuard] req.query.role:', queryRole);
    return (
      !roles ||
      (Boolean(queryRole) &&
        typeof queryRole === 'string' &&
        roles.includes(queryRole))
    );
  }
}
