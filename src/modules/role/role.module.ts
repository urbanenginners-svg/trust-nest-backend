import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { Permission } from '../permission/permission.entity';
import { User } from '../user/user.entity';
import { AbilityFactory } from '../../common/casl/ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  controllers: [RoleController],
  providers: [RoleService, AbilityFactory],
  exports: [RoleService, AbilityFactory],
})
export class RoleModule {}
