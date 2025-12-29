import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object for updating a user
 * All fields are optional (inherited from CreateUserDto)
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
