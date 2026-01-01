import { PartialType } from '@nestjs/swagger';
import { CreatePoolDto } from './create-pool.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { PoolStatus } from '../enums/pool-status.enum';

/**
 * Data Transfer Object for updating an existing pool
 */
export class UpdatePoolDto extends PartialType(CreatePoolDto) {
  @ApiProperty({
    description: 'Current status of the pool',
    enum: PoolStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PoolStatus)
  status?: PoolStatus;

  @ApiProperty({
    description: 'Price of the pool item (set by admin during approval)',
    example: 99.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  poolPrice?: number;

  @ApiProperty({
    description: 'Whether the pool item is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Whether the pool item is approved',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
