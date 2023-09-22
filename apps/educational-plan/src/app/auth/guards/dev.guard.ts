import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_DEV_KEY } from '../decorators/dev.decorator';

@Injectable()
export class DevGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isDev = this.reflector.getAllAndOverride<boolean>(IS_DEV_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if(!isDev) return true;
    const production = process.env.NODE_ENV === 'production';
    return isDev && !production;
  }
}