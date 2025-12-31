import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new permission
 */
export class CreatePermissionDto {
  @ApiProperty({
    description: 'The name of the permission',
    example: 'users.read',
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'The resource this permission applies to',
    example: 'user',
  })
  @IsNotEmpty()
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'The action this permission allows',
    example: 'read',
    enum: ['create', 'read', 'update', 'delete', 'manage'],
  })
  @IsNotEmpty()
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Description of the permission',
    example: 'Allows reading user information',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the permission is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
