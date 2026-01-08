import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for verifying Razorpay payment
 */
export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Razorpay order ID',
    example: 'order_xyz123',
  })
  @IsNotEmpty({ message: 'Razorpay order ID is required' })
  @IsString({ message: 'Order ID must be a string' })
  razorpayOrderId: string;

  @ApiProperty({
    description: 'Razorpay payment ID',
    example: 'pay_abc456',
  })
  @IsNotEmpty({ message: 'Razorpay payment ID is required' })
  @IsString({ message: 'Payment ID must be a string' })
  razorpayPaymentId: string;

  @ApiProperty({
    description: 'Razorpay signature for verification',
    example: 'signature_here',
  })
  @IsNotEmpty({ message: 'Razorpay signature is required' })
  @IsString({ message: 'Signature must be a string' })
  razorpaySignature: string;
}
