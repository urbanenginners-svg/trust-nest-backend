import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UseInterceptors, applyDecorators } from '@nestjs/common';

/**
 * Metadata key for serialization groups
 */
export const SERIALIZATION_GROUPS_KEY = 'serialization_groups';

/**
 * Enum for serialization groups
 */
export enum SerializationGroups {
  ADMIN = 'admin',
  USER = 'user',
  PUBLIC = 'public',
}

/**
 * Type alias for backwards compatibility
 */
export type SerializationGroupsType = SerializationGroups | 'admin' | 'user' | 'public';

/**
 * Decorator to set serialization groups based on user context
 */
export function SerializeResponse(...groups: SerializationGroupsType[]) {
  return applyDecorators(
    SetMetadata(SERIALIZATION_GROUPS_KEY, groups),
    UseInterceptors(ClassSerializerInterceptor),
  );
}

/**
 * Decorator to get the current user's role context for serialization
 */
export const CurrentUserContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return SerializationGroups.PUBLIC;

    // Check if user has superadmin role or admin permissions
    const isSuperAdmin = user.roles?.some((role) => role.name === 'superadmin');
    const isAdmin = user.roles?.some((role) =>
      role.permissions?.some(
        (permission) =>
          permission.resource === 'user' && permission.action === 'manage',
      ),
    );

    if (isSuperAdmin || isAdmin) return SerializationGroups.ADMIN;
    return SerializationGroups.USER;
  },
);
