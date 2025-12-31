import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new role
 */
export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator with full system access',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the role is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
