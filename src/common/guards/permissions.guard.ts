import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../casl/ability.factory';
import {
  RequiredPermission,
  PERMISSION_CHECKER_KEY,
} from '../decorators/check-permissions.decorator';
import { User } from '../../modules/user/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<RequiredPermission[]>(
      PERMISSION_CHECKER_KEY,
      context.getHandler(),
    );

    // If no permissions are required, allow access
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // If no user is authenticated, deny access
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Create ability for the user
    const ability = this.abilityFactory.createForUser(user);

    // Check if user has all required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      ability.can(permission.action, permission.subject),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
