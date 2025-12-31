import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

/**
 * Swagger decorator for creating a user
 * POST /users
 */
export function CreateUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({
      status: 201,
      description: 'User successfully created',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          isActive: true,
          roles: [],
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
      description: 'Conflict - email already exists',
    }),
  );
}

/**
 * Swagger decorator for getting all users
 * GET /users
 */
export function FindAllUsersSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiOkResponse({
      description: 'List of all users',
      schema: {
        example: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            isActive: true,
            roles: [],
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
 * Swagger decorator for getting a user by ID
 * GET /users/:id
 */
export function FindOneUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user by ID' }),
    ApiParam({
      name: 'id',
      description: 'User UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'User found',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          isActive: true,
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
      description: 'User not found',
    }),
  );
}

/**
 * Swagger decorator for updating a user
 * PATCH /users/:id
 */
export function UpdateUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user by ID' }),
    ApiParam({
      name: 'id',
      description: 'User UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'User successfully updated',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          firstName: 'John Updated',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T01:00:00.000Z',
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
      description: 'User not found',
    }),
  );
}

/**
 * Swagger decorator for deleting a user
 * DELETE /users/:id
 */
export function RemoveUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a user by ID' }),
    ApiParam({
      name: 'id',
      description: 'User UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      status: 204,
      description: 'User successfully deleted',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
  );
}
