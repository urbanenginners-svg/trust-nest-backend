import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');
import { Donation } from './donation.entity';
import { Pool } from '../pool/pool.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FilterDonationsDto } from './dto/filter-donations.dto';
import { DonationStatus } from './enums/donation-status.enum';
import { PoolStatus } from '../pool/enums/pool-status.enum';

/**
 * Service for managing donations
 */
@Injectable()
export class DonationService {
  private readonly logger = new Logger(DonationService.name);
  private razorpayInstance: any;

  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
  ) {
    // Initialize Razorpay
    // Make sure to set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file
    this.razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  /**
   * Create a Razorpay order for donation
   */
  async createDonationOrder(
    createDonationDto: CreateDonationDto,
    userId?: string,
  ) {
    const {
      amount,
      poolId,
      message,
      anonymousDonorName,
      anonymousDonorEmail,
      anonymousDonorPhone,
    } = createDonationDto;

    // Validate pool exists and is active
    const pool = await this.poolRepository.findOne({
      where: { id: poolId },
    });

    if (!pool) {
      throw new NotFoundException('Pool not found');
    }

    if (!pool.isActive || !pool.isApproved) {
      throw new BadRequestException('Pool is not accepting donations');
    }

    if (!pool.poolPrice) {
      throw new BadRequestException('Pool price is not set');
    }

    // Check if pool has already reached target
    if (pool.status === PoolStatus.TARGET_REACHED) {
      throw new BadRequestException('Pool has already reached its target');
    }

    // Calculate remaining amount needed
    const remainingAmount =
      Number(pool.poolPrice) - Number(pool.amountReceived);

    if (remainingAmount <= 0) {
      throw new BadRequestException(
        'Pool has already reached its target amount',
      );
    }

    // Validate donation amount doesn't exceed remaining amount
    if (amount > remainingAmount) {
      throw new BadRequestException(
        `Donation amount exceeds remaining pool amount. Maximum allowed: ${remainingAmount.toFixed(2)}`,
      );
    }

    // Validate anonymous donor info if not logged in
    if (!userId) {
      if (!anonymousDonorEmail) {
        throw new BadRequestException(
          'Email is required for anonymous donations',
        );
      }
      if (!anonymousDonorName) {
        throw new BadRequestException(
          'Name is required for anonymous donations',
        );
      }
    }

    try {
      // Create Razorpay order
      const razorpayOrder = await this.razorpayInstance.orders.create({
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        receipt: `donation_${Date.now()}`,
        notes: {
          poolId,
          userId: userId || 'anonymous',
          message: message || '',
        },
      });

      // Create donation record with PENDING status
      const donation = this.donationRepository.create({
        amount,
        poolId,
        userId,
        message,
        anonymousDonorName: userId ? null : anonymousDonorName,
        anonymousDonorEmail: userId ? null : anonymousDonorEmail,
        anonymousDonorPhone: userId ? null : anonymousDonorPhone,
        razorpayOrderId: razorpayOrder.id,
        status: DonationStatus.PENDING,
      });

      const savedDonation = await this.donationRepository.save(donation);

      this.logger.log(
        `Donation order created: ${savedDonation.id} for pool ${poolId}`,
      );

      return {
        donationId: savedDonation.id,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      this.logger.error('Failed to create Razorpay order:', error);
      throw new BadRequestException('Failed to create payment order');
    }
  }

  /**
   * Verify Razorpay payment and update donation status
   */
  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      verifyPaymentDto;

    // Find donation by order ID
    const donation = await this.donationRepository.findOne({
      where: { razorpayOrderId },
      relations: ['pool'],
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    if (donation.status === DonationStatus.SUCCESS) {
      throw new BadRequestException('Payment already verified');
    }

    // Verify signature
    const isValid = this.verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValid) {
      // Update donation status to FAILED
      donation.status = DonationStatus.FAILED;
      await this.donationRepository.save(donation);
      throw new BadRequestException('Invalid payment signature');
    }

    // Update donation with payment details
    donation.razorpayPaymentId = razorpayPaymentId;
    donation.razorpaySignature = razorpaySignature;
    donation.status = DonationStatus.SUCCESS;
    await this.donationRepository.save(donation);

    // Update pool's amountReceived
    const pool = donation.pool;
    const newAmountReceived =
      Number(pool.amountReceived) + Number(donation.amount);
    pool.amountReceived = newAmountReceived;

    // Check if target is reached
    if (newAmountReceived >= Number(pool.poolPrice)) {
      pool.status = PoolStatus.TARGET_REACHED;
      this.logger.log(`Pool ${pool.id} has reached its target!`);
    }

    await this.poolRepository.save(pool);

    this.logger.log(
      `Payment verified for donation: ${donation.id}, Pool updated: ${pool.id}`,
    );

    return {
      success: true,
      message: 'Payment verified successfully',
      donation: donation,
    };
  }

  /**
   * Verify Razorpay signature
   */
  private verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  }

  /**
   * Get all donations with optional filters
   */
  async findAll(filterDto?: FilterDonationsDto) {
    const query = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.pool', 'pool')
      .leftJoinAndSelect('donation.user', 'user')
      .orderBy('donation.createdAt', 'DESC');

    if (filterDto?.poolId) {
      query.andWhere('donation.poolId = :poolId', { poolId: filterDto.poolId });
    }

    if (filterDto?.userId) {
      query.andWhere('donation.userId = :userId', { userId: filterDto.userId });
    }

    if (filterDto?.status) {
      query.andWhere('donation.status = :status', { status: filterDto.status });
    }

    return await query.getMany();
  }

  /**
   * Get a single donation by ID
   */
  async findOne(id: string) {
    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: ['pool', 'user'],
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    return donation;
  }

  /**
   * Get donations by pool
   */
  async findByPool(poolId: string) {
    return await this.donationRepository.find({
      where: { poolId, status: DonationStatus.SUCCESS },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get donations by user
   */
  async findByUser(userId: string) {
    return await this.donationRepository.find({
      where: { userId },
      relations: ['pool'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get donation statistics for a pool
   */
  async getPoolDonationStats(poolId: string) {
    const pool = await this.poolRepository.findOne({ where: { id: poolId } });

    if (!pool) {
      throw new NotFoundException('Pool not found');
    }

    const donations = await this.donationRepository.find({
      where: { poolId, status: DonationStatus.SUCCESS },
    });

    const totalDonations = donations.length;
    const totalAmount = donations.reduce(
      (sum, donation) => sum + Number(donation.amount),
      0,
    );
    const remainingAmount =
      Number(pool.poolPrice) - Number(pool.amountReceived);
    const percentageReached = pool.poolPrice
      ? (Number(pool.amountReceived) / Number(pool.poolPrice)) * 100
      : 0;

    return {
      poolId,
      poolName: pool.name,
      poolPrice: Number(pool.poolPrice),
      amountReceived: Number(pool.amountReceived),
      remainingAmount: Math.max(0, remainingAmount),
      percentageReached: Math.min(100, percentageReached),
      totalDonations,
      donations: donations,
    };
  }
}
