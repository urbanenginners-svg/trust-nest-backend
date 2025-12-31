import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

/**
 * Data Transfer Object for creating a new sample product
 */
export class CreateSampleProductDto {
  @ApiProperty({
    description: 'The name of the sample product',
    example: 'Protein Supplements',
    minLength: 2,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the sample product',
    example: 'Nutritional supplements for muscle building and recovery',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Sample product code for internal reference',
    example: 'PROT_SUPP',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  code?: string;
}