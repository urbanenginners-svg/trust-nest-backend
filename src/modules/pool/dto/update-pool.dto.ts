import { PartialType } from '@nestjs/swagger';
import { CreatePoolDto } from './create-pool.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

/**
 * Data Transfer Object for updating an existing pool
 */
export class UpdatePoolDto extends PartialType(CreatePoolDto) {
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
