import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for assigning permissions to a role
 */
export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to the role',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '987fcdeb-51a2-43d1-9f12-345678901234',
    ],
    type: [String],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  permissionIds: string[];
}
