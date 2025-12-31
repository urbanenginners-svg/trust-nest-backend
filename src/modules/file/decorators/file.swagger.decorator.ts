import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { File, FileModuleName } from '../file.entity';

/**
 * Swagger decorator for file upload endpoint
 */
export function UploadFileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload a file',
      description:
        'Upload a file to the server and return file metadata with unique identifier',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'File upload',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'The file to upload',
          },
        },
        required: ['file'],
      },
    }),
    ApiQuery({
      name: 'moduleName',
      required: false,
      description: 'Module/context the file is related to',
      enum: FileModuleName,
      example: FileModuleName.USER,
    }),
    ApiResponse({
      status: 201,
      description: 'File uploaded successfully',
      type: File,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - No file provided or invalid file',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error - Failed to upload file',
    }),
  );
}

/**
 * Swagger decorator for file download endpoint
 */
export function DownloadFileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Download a file',
      description: 'Download a file by its unique identifier',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the file',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'File downloaded successfully',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'File not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}

/**
 * Swagger decorator for create file metadata endpoint
 */
export function CreateFileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create file metadata',
      description: 'Create file metadata entry (for externally uploaded files)',
    }),
    ApiResponse({
      status: 201,
      description: 'File metadata created successfully',
      type: File,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid file data',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}

/**
 * Swagger decorator for find all files endpoint
 */
export function FindAllFilesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all files',
      description: 'Retrieve all files with optional filtering by module',
    }),
    ApiQuery({
      name: 'moduleName',
      required: false,
      description: 'Filter files by module name',
      enum: FileModuleName,
      example: FileModuleName.USER,
    }),
    ApiResponse({
      status: 200,
      description: 'Files retrieved successfully',
      type: [File],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}

/**
 * Swagger decorator for find one file endpoint
 */
export function FindOneFileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get file by ID',
      description: 'Retrieve a specific file by its unique identifier',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the file',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'File retrieved successfully',
      type: File,
    }),
    ApiResponse({
      status: 404,
      description: 'File not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}

/**
 * Swagger decorator for update file endpoint
 */
export function UpdateFileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update file metadata',
      description: 'Update file metadata by its unique identifier',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the file',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'File updated successfully',
      type: File,
    }),
    ApiResponse({
      status: 404,
      description: 'File not found',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid update data',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}

/**
 * Swagger decorator for remove file endpoint
 */
export function RemoveFileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete file',
      description: 'Soft delete a file by its unique identifier',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the file',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 204,
      description: 'File deleted successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'File not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}
