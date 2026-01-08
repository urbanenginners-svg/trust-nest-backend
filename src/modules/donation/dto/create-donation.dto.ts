import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsEmail,
  IsUUID,
  Min,
} from 'class-validator';

/**
 * DTO for initiating a donation
 */
export class CreateDonationDto {
  @ApiProperty({
    description: 'Amount to donate',
    example: 50.0,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  @Min(1, { message: 'Minimum donation amount is 1' })
  amount: number;

  @ApiProperty({
    description: 'Pool ID to donate to',
    example: 'uuid-here',
  })
  @IsNotEmpty({ message: 'Pool ID is required' })
  @IsUUID('4', { message: 'Pool ID must be a valid UUID' })
  poolId: string;

  @ApiProperty({
    description: 'Optional message from the donor',
    example: 'Hope this helps with the testing!',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Message must be a string' })
  message?: string;

  // Anonymous donor fields (only for non-logged-in users)
  @ApiProperty({
    description: 'Name of anonymous donor (required if not logged in)',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Donor name must be a string' })
  anonymousDonorName?: string;

  @ApiProperty({
    description: 'Email of anonymous donor (required if not logged in)',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  anonymousDonorEmail?: string;

  @ApiProperty({
    description: 'Phone number of anonymous donor',
    example: '+919876543210',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  anonymousDonorPhone?: string;
}
