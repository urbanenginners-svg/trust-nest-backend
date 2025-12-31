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
import { SampleProduct } from '../sample-product.entity';
import { CreateSampleProductDto } from '../dto/create-sample-product.dto';
import { UpdateSampleProductDto } from '../dto/update-sample-product.dto';

/**
 * Swagger decorators for Sample Product endpoints
 */

export const SampleProductSwagger = {
  /**
   * Swagger decorators for creating a sample product
   */
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new sample product',
        description: 'Creates a new sample product like "Protein Supplements", "Pulses & Lentils", etc.',
      }),
      ApiBody({ type: CreateSampleProductDto }),
      ApiResponse({
        status: 201,
        description: 'Sample product created successfully',
        type: SampleProduct,
      }),
      ApiResponse({
        status: 400,
        description: 'Invalid input data',
      }),
      ApiResponse({
        status: 409,
        description: 'Sample product with the same name or code already exists',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for getting all sample products
   */
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get all sample products',
        description: 'Retrieves all sample products with optional filtering',
      }),
      ApiQuery({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Whether to include inactive sample products',
        example: false,
      }),
      ApiResponse({
        status: 200,
        description: 'Sample products retrieved successfully',
        type: [SampleProduct],
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for getting a specific sample product
   */
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get a sample product by ID',
        description: 'Retrieves a specific sample product by its ID',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Sample product ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Sample product retrieved successfully',
        type: SampleProduct,
      }),
      ApiResponse({
        status: 404,
        description: 'Sample product not found',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for updating a sample product
   */
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a sample product',
        description: 'Updates an existing sample product',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Sample product ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiBody({ type: UpdateSampleProductDto }),
      ApiResponse({
        status: 200,
        description: 'Sample product updated successfully',
        type: SampleProduct,
      }),
      ApiResponse({
        status: 400,
        description: 'Invalid input data',
      }),
      ApiResponse({
        status: 404,
        description: 'Sample product not found',
      }),
      ApiResponse({
        status: 409,
        description: 'Sample product with the same name or code already exists',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for soft deleting a sample product
   */
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Soft delete a sample product',
        description: 'Deactivates a sample product (sets isActive to false)',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Sample product ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Sample product deactivated successfully',
      }),
      ApiResponse({
        status: 404,
        description: 'Sample product not found',
      }),
      ApiBearerAuth(),
    ),

  /**
   * Swagger decorators for hard deleting a sample product
   */
  HardDelete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Permanently delete a sample product',
        description: 'Permanently removes a sample product from the database',
      }),
      ApiParam({
        name: 'id',
        type: 'string',
        description: 'Sample product ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: 200,
        description: 'Sample product deleted permanently',
      }),
      ApiResponse({
        status: 404,
        description: 'Sample product not found',
      }),
      ApiBearerAuth(),
    ),
};