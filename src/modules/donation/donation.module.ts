import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { Donation } from './donation.entity';
import { Pool } from '../pool/pool.entity';

/**
 * Donation Module
 * Handles donation functionality with Razorpay integration
 */
@Module({
  imports: [TypeOrmModule.forFeature([Donation, Pool])],
  controllers: [DonationController],
  providers: [DonationService],
  exports: [DonationService],
})
export class DonationModule {}
