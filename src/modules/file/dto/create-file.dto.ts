import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { FileModuleName } from '../file.entity';

export class CreateFileDto {
  @ApiProperty({
    description: 'Original name of the file',
    example: 'document.pdf',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fileType: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 1048576,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  fileSize: number;

  @ApiProperty({
    description: 'ID of the user who uploaded the file',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  uploaderId: string;

  @ApiProperty({
    description: 'Server path where the file is stored',
    example: 'uploads/general/123e4567-e89b-12d3-a456-426614174000.pdf',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  filePath: string;

  @ApiPropertyOptional({
    description: 'Module/context the file is related to',
    enum: FileModuleName,
    example: FileModuleName.USER,
    default: FileModuleName.GENERAL,
  })
  @IsOptional()
  @IsEnum(FileModuleName)
  moduleName?: FileModuleName = FileModuleName.GENERAL;
}
