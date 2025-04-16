import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    const { role } = user;

    if (role !== 'ADMIN' && role !== 'SUPERUSER') {
      throw new ForbiddenException('Access denied: Admin or Superuser only');
    }

    return true;
  }
}
