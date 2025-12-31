import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Pool } from '../pool.entity';
import { CreatePoolDto } from '../dto/create-pool.dto';
import { UpdatePoolDto } from '../dto/update-pool.dto';

/**
 * Swagger decorators for Pool endpoints
 */

export const PoolSwagger = {
  /**
   * Swagger decorators for creating a pool
   */
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new pool',
        description:
          'Creates a new pool item with sample information and pricing',
      }),
      ApiBody({ type: CreatePoolDto }),
      ApiResponse({
        status: 201,
        description: 'Pool created successfully',
        type: Pool,
      }),
      ApiResponse({
        status: 400,
        description: 'Invalid input data',
      }),
      ApiResponse({
        status: 404,
        description: 'Category or file not found',
      }),
      ApiResponse({
        status: 409,
        description:
          'Pool with the same batch number already exists for this category',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for getting all pools
   */
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get all pools',
        description: 'Retrieves all pools with optional filtering',
      }),
      ApiQuery({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Whether to include inactive pools',
        example: false,
      }),
      ApiQuery({
        name: 'includeDeleted',
        required: false,
        type: Boolean,
        description: 'Whether to include soft-deleted pools',
        example: false,
      }),
      ApiQuery({
        name: 'includeUnapproved',
        required: false,
        type: Boolean,
        description: 'Whether to include unapproved pools',
        example: false,
      }),
      ApiResponse({
        status: 200,
        description: 'Pools retrieved successfully',
        type: [Pool],
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for getting pools by user
   */
  FindByUser: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get pools by user',
        description: 'Retrieves all pools created by the current user',
      }),
      ApiQuery({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Whether to include inactive pools',
        example: false,
      }),
      ApiQuery({
        name: 'includeDeleted',
        required: false,
        type: Boolean,
        description: 'Whether to include soft-deleted pools',
        example: false,
      }),
      ApiResponse({
        status: 200,
        description: 'User pools retrieved successfully',
        type: [Pool],
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for getting a specific pool
   */
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get a pool by ID',
        description: 'Retrieves a specific pool by its ID',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Pool ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pool retrieved successfully',
        type: Pool,
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for updating a pool
   */
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a pool',
        description: 'Updates an existing pool (only owner or admin)',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Pool ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiBody({ type: UpdatePoolDto }),
      ApiResponse({
        status: 200,
        description: 'Pool updated successfully',
        type: Pool,
      }),
      ApiResponse({
        status: 400,
        description: 'Invalid input data',
      }),
      ApiResponse({
        status: 403,
        description: 'Forbidden: You can only update pools that you created',
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
      ApiResponse({
        status: 409,
        description:
          'Pool with the same batch number already exists for this category',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for deleting a pool
   */
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a pool (soft delete)',
        description: 'Soft deletes a pool (only owner or admin)',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Pool ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pool deleted successfully',
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Pool with ID "uuid" has been deleted',
            },
          },
        },
      }),
      ApiResponse({
        status: 403,
        description: 'Forbidden: You can only delete pools that you created',
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for hard deleting a pool
   */
  HardDelete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Permanently delete a pool (admin only)',
        description: 'Permanently deletes a pool from the database',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Pool ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pool permanently deleted successfully',
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Pool with ID "uuid" has been permanently deleted',
            },
          },
        },
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for restoring a pool
   */
  Restore: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Restore a deleted pool (admin only)',
        description: 'Restores a soft-deleted pool',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Pool ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pool restored successfully',
        type: Pool,
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for approving a pool
   */
  Approve: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Approve a pool (admin only)',
        description: 'Approves a pool for public visibility',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Pool ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pool approved successfully',
        type: Pool,
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for rejecting a pool
   */
  Reject: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Reject/Unapprove a pool (admin only)',
        description: 'Rejects or removes approval from a pool',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Pool ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Pool rejected successfully',
        type: Pool,
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
      ApiBearerAuth(),
    ),
};
