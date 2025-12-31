import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { Pool } from './pool.entity';
import { SampleProduct } from '../sample-product/sample-product.entity';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';
import { Permission } from '../permission/permission.entity';
import { AbilityFactory } from '../../common/casl/ability.factory';

/**
 * Pool Module
 * Handles pool-related functionality including CRUD operations
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Pool, SampleProduct, File, User, Permission]),
  ],
  controllers: [PoolController],
  providers: [PoolService, AbilityFactory],
  exports: [PoolService, TypeOrmModule],
})
export class PoolModule {}
