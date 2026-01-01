import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  IsUUID,
  IsPositive,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new pool
 */
export class CreatePoolDto {
  @ApiProperty({
    description: 'The name of the pool item',
    example: 'Premium Whey Protein Sample',
    minLength: 2,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Category ID reference to sample product',
    example: 'uuid-sample-product-id',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Source of the sample',
    example: 'Lab Testing Facility A',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  sampleSource: string;

  @ApiProperty({
    description: 'Batch number for tracking',
    example: 'BATCH-001-2024',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  batchNumber: string;

  @ApiProperty({
    description: 'Sample image file ID',
    example: 'uuid-file-id',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  sampleImageId?: string;

  @ApiProperty({
    description: 'Detailed description of the pool item',
    example: 'High-quality protein sample for laboratory analysis',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
