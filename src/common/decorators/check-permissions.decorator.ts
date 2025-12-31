import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from '../casl/ability.factory';

// Interface for permission requirements
export interface RequiredPermission {
  action: Action;
  subject: Subjects;
}

// Metadata key for permissions
export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';

/**
 * Decorator to check permissions on routes
 * Usage: @CheckPermissions({ action: Action.READ, subject: User })
 */
export const CheckPermissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSION_CHECKER_KEY, permissions);
