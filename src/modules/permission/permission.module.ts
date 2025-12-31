import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';
import { User } from '../user/user.entity';
import { AbilityFactory } from '../../common/casl/ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User])],
  controllers: [PermissionController],
  providers: [PermissionService, AbilityFactory],
  exports: [PermissionService, AbilityFactory],
})
export class PermissionModule {}
