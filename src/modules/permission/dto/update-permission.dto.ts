import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

/**
 * Data Transfer Object for updating a permission
 * All fields are optional (inherited from CreatePermissionDto)
 */
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
