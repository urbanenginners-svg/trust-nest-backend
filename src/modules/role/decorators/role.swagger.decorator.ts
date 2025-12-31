import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Role } from '../role.entity';

/**
 * Swagger decorator for creating a role
 * POST /roles
 */
export function CreateRoleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new role' }),
    ApiOkResponse({
      status: 201,
      description: 'Role created successfully',
      type: Role,
    }),
    ApiBadRequestResponse({
      description: 'Bad request - validation failed',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiConflictResponse({
      description: 'Conflict - role name already exists',
    }),
  );
}

/**
 * Swagger decorator for getting all roles
 * GET /roles
 */
export function FindAllRolesSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all roles' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: 'number',
      description: 'Page number (starts from 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'number',
      description: 'Number of items per page',
      example: 10,
    }),
    ApiOkResponse({
      description: 'List of roles retrieved successfully',
      type: [Role],
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
  );
}

/**
 * Swagger decorator for getting a role by ID
 * GET /roles/:id
 */
export function FindOneRoleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a role by ID' }),
    ApiParam({
      name: 'id',
      description: 'Role UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Role retrieved successfully',
      type: Role,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Role not found',
    }),
  );
}

/**
 * Swagger decorator for updating a role
 * PATCH /roles/:id
 */
export function UpdateRoleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a role' }),
    ApiParam({
      name: 'id',
      description: 'Role UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Role updated successfully',
      type: Role,
    }),
    ApiBadRequestResponse({
      description: 'Bad request - validation failed',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Role not found',
    }),
  );
}

/**
 * Swagger decorator for deleting a role
 * DELETE /roles/:id
 */
export function RemoveRoleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a role' }),
    ApiParam({
      name: 'id',
      description: 'Role UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      status: 204,
      description: 'Role deleted successfully',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Role not found',
    }),
    ApiConflictResponse({
      description: 'Conflict - cannot delete superadmin role',
    }),
  );
}

/**
 * Swagger decorator for assigning permissions to a role
 * POST /roles/:id/permissions
 */
export function AssignPermissionsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Assign permissions to a role' }),
    ApiParam({
      name: 'id',
      description: 'Role UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Permissions successfully assigned to role',
    }),
    ApiBadRequestResponse({
      description: 'Bad request - validation failed',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Role or permissions not found',
    }),
  );
}

/**
 * Swagger decorator for removing permissions from a role
 * DELETE /roles/:id/permissions
 */
export function RemovePermissionsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove permissions from a role' }),
    ApiParam({
      name: 'id',
      description: 'Role UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Permissions successfully removed from role',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Role not found',
    }),
  );
}
