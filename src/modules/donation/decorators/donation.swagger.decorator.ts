import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';

/**
 * Swagger decorators for donation endpoints
 */
export class DonationSwagger {
  static createDonationOrder() {
    return applyDecorators(
      ApiOperation({
        summary: 'Create a donation order',
        description:
          'Creates a Razorpay order for donation. Accessible to both logged-in and anonymous users. For anonymous users, name and email are required.',
      }),
      ApiBody({ type: CreateDonationDto }),
      ApiResponse({
        status: 201,
        description: 'Donation order created successfully',
        schema: {
          type: 'object',
          properties: {
            donationId: { type: 'string', example: 'uuid-here' },
            orderId: { type: 'string', example: 'order_xyz123' },
            amount: { type: 'number', example: 5000 },
            currency: { type: 'string', example: 'INR' },
            keyId: { type: 'string', example: 'rzp_test_xxx' },
          },
        },
      }),
      ApiResponse({
        status: 400,
        description:
          'Bad request - Invalid data or pool not accepting donations',
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
    );
  }

  static verifyPayment() {
    return applyDecorators(
      ApiOperation({
        summary: 'Verify Razorpay payment',
        description:
          'Verifies the payment signature and updates the donation status. Also updates the pool amount received and status if target is reached.',
      }),
      ApiBody({ type: VerifyPaymentDto }),
      ApiResponse({
        status: 200,
        description: 'Payment verified successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: {
              type: 'string',
              example: 'Payment verified successfully',
            },
            donation: { type: 'object' },
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'Invalid signature or payment already verified',
      }),
      ApiResponse({
        status: 404,
        description: 'Donation not found',
      }),
    );
  }

  static getAllDonations() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get all donations',
        description:
          'Retrieves all donations with optional filters (admin only)',
      }),
      ApiQuery({
        name: 'poolId',
        required: false,
        type: String,
        description: 'Filter by pool ID',
      }),
      ApiQuery({
        name: 'userId',
        required: false,
        type: String,
        description: 'Filter by user ID',
      }),
      ApiQuery({
        name: 'status',
        required: false,
        enum: ['Pending', 'Success', 'Failed'],
        description: 'Filter by donation status',
      }),
      ApiResponse({
        status: 200,
        description: 'List of donations retrieved successfully',
      }),
    );
  }

  static getDonationById() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get donation by ID',
        description: 'Retrieves a specific donation by its ID',
      }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Donation ID',
      }),
      ApiResponse({
        status: 200,
        description: 'Donation retrieved successfully',
      }),
      ApiResponse({
        status: 404,
        description: 'Donation not found',
      }),
    );
  }

  static getDonationsByPool() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get donations by pool',
        description: 'Retrieves all successful donations for a specific pool',
      }),
      ApiParam({
        name: 'poolId',
        type: String,
        description: 'Pool ID',
      }),
      ApiResponse({
        status: 200,
        description: 'Donations retrieved successfully',
      }),
    );
  }

  static getPoolDonationStats() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get pool donation statistics',
        description:
          'Retrieves statistics for donations to a specific pool including total amount, remaining amount, and percentage reached',
      }),
      ApiParam({
        name: 'poolId',
        type: String,
        description: 'Pool ID',
      }),
      ApiResponse({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            poolId: { type: 'string' },
            poolName: { type: 'string' },
            poolPrice: { type: 'number' },
            amountReceived: { type: 'number' },
            remainingAmount: { type: 'number' },
            percentageReached: { type: 'number' },
            totalDonations: { type: 'number' },
            donations: { type: 'array' },
          },
        },
      }),
      ApiResponse({
        status: 404,
        description: 'Pool not found',
      }),
    );
  }

  static getMyDonations() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get my donations',
        description: 'Retrieves all donations made by the authenticated user',
      }),
      ApiResponse({
        status: 200,
        description: 'User donations retrieved successfully',
      }),
      ApiResponse({
        status: 401,
        description: 'Unauthorized',
      }),
    );
  }
}
