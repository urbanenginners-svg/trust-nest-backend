import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { DonationStatus } from '../enums/donation-status.enum';

/**
 * DTO for filtering donations
 */
export class FilterDonationsDto {
  @ApiPropertyOptional({
    description: 'Filter by pool ID',
    example: 'uuid-here',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Pool ID must be a valid UUID' })
  poolId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 'uuid-here',
  })
  @IsOptional()
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by donation status',
    enum: DonationStatus,
    example: DonationStatus.SUCCESS,
  })
  @IsOptional()
  @IsEnum(DonationStatus, { message: 'Invalid donation status' })
  status?: DonationStatus;
}
