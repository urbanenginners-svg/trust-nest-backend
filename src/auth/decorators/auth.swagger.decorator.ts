import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

/**
 * Swagger decorator for user login
 * POST /auth/login
 */
export function LoginSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiOkResponse({
      description: 'Login successful',
      schema: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          token_type: { type: 'string', example: 'Bearer' },
          expires_in: { type: 'number', example: 3600 },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              name: { type: 'string', example: 'Super Admin' },
              email: { type: 'string', example: 'superadmin@example.com' },
              isActive: { type: 'boolean', example: true },
              roles: { type: 'array' },
            },
          },
        },
        example: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          token_type: 'Bearer',
          expires_in: 3600,
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Super Admin',
            email: 'superadmin@example.com',
            isActive: true,
            roles: [],
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
    }),
  );
}

/**
 * Swagger decorator for getting user profile
 * GET /auth/profile
 */
export function GetProfileSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user profile' }),
    ApiOkResponse({
      description: 'User profile retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          name: { type: 'string', example: 'Super Admin' },
          email: { type: 'string', example: 'superadmin@example.com' },
          isActive: { type: 'boolean', example: true },
          roles: { type: 'array' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Super Admin',
          email: 'superadmin@example.com',
          isActive: true,
          roles: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - invalid or missing token',
    }),
  );
}

/**
 * Swagger decorator for getting superadmin credentials
 * GET /auth/superadmin
 */
export function GetSuperAdminSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get superadmin credentials for testing' }),
    ApiOkResponse({
      description: 'Superadmin credentials',
      schema: {
        type: 'object',
        properties: {
          user: { type: 'object' },
          instructions: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              credentials: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
              usage: { type: 'object' },
            },
          },
        },
        example: {
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Super Admin',
            email: 'superadmin@example.com',
            isActive: true,
          },
          instructions: {
            message: 'Use the login endpoint to get JWT token',
            credentials: {
              email: 'superadmin@example.com',
              password: 'SuperAdmin123!',
            },
            usage: {
              step1: 'POST /auth/login with above credentials',
              step2: 'Copy the access_token from response',
              step3: 'Add Authorization header: Bearer {access_token}',
            },
          },
        },
      },
    }),
  );
}
