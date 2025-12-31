import { PartialType } from '@nestjs/swagger';
import { CreateSampleProductDto } from './create-sample-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

/**
 * Data Transfer Object for updating an existing sample product
 */
export class UpdateSampleProductDto extends PartialType(
  CreateSampleProductDto,
) {
  @ApiProperty({
    description: 'Whether the sample product is active',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
