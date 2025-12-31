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

/**
 * Swagger decorator for creating a permission
 * POST /permissions
 */
export function CreatePermissionSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new permission' }),
    ApiResponse({
      status: 201,
      description: 'Permission successfully created',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          resource: 'user',
          action: 'create',
          description: 'Can create users',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad request - validation failed',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiConflictResponse({
      description: 'Conflict - permission name already exists',
    }),
  );
}

/**
 * Swagger decorator for getting all permissions
 * GET /permissions
 */
export function FindAllPermissionsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all permissions' }),
    ApiQuery({
      name: 'resource',
      required: false,
      description: 'Filter by resource',
    }),
    ApiOkResponse({
      description: 'List of all permissions',
      schema: {
        example: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            resource: 'user',
            action: 'create',
            description: 'Can create users',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
  );
}

/**
 * Swagger decorator for getting a permission by ID
 * GET /permissions/:id
 */
export function FindOnePermissionSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a permission by ID' }),
    ApiParam({
      name: 'id',
      description: 'Permission UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Permission found with associated roles',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          resource: 'user',
          action: 'create',
          description: 'Can create users',
          roles: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Permission not found',
    }),
  );
}

/**
 * Swagger decorator for updating a permission
 * PATCH /permissions/:id
 */
export function UpdatePermissionSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a permission by ID' }),
    ApiParam({
      name: 'id',
      description: 'Permission UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Permission successfully updated',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          resource: 'user',
          action: 'update',
          description: 'Can update users',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad request - validation failed',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Permission not found',
    }),
    ApiConflictResponse({
      description: 'Conflict - permission name already exists',
    }),
  );
}

/**
 * Swagger decorator for deleting a permission
 * DELETE /permissions/:id
 */
export function RemovePermissionSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a permission by ID' }),
    ApiParam({
      name: 'id',
      description: 'Permission UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      status: 204,
      description: 'Permission successfully deleted',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'Permission not found',
    }),
  );
}
