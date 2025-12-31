import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

/**
 * Data Transfer Object for updating a role
 * All fields are optional (inherited from CreateRoleDto)
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
