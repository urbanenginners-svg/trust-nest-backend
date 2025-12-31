import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleProductService } from './sample-product.service';
import { SampleProductController } from './sample-product.controller';
import { SampleProduct } from './sample-product.entity';
import { Permission } from '../permission/permission.entity';
import { AbilityFactory } from '../../common/casl/ability.factory';

/**
 * Sample Product Module
 * Encapsulates all sample product-related functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([SampleProduct, Permission])],
  controllers: [SampleProductController],
  providers: [SampleProductService, AbilityFactory],
  exports: [SampleProductService],
})
export class SampleProductModule {}
