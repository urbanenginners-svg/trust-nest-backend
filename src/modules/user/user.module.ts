import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';
import { AbilityFactory } from '../../common/casl/ability.factory';

/**
 * User Module
 * Encapsulates all user-related functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UserController],
  providers: [UserService, AbilityFactory],
  exports: [UserService, AbilityFactory],
})
export class UserModule {}
