import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateFileDto } from './create-file.dto';
import { FileModuleName } from '../file.entity';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  @ApiPropertyOptional({
    description: 'Whether the file has been soft deleted',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Updated file name',
    example: 'renamed-document.pdf',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  fileName?: string;

  @ApiPropertyOptional({
    description: 'Updated module name',
    enum: FileModuleName,
    example: FileModuleName.USER,
  })
  @IsOptional()
  @IsEnum(FileModuleName)
  moduleName?: FileModuleName;
}
