import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FilterDonationsDto } from './dto/filter-donations.dto';
import { Donation } from './donation.entity';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  SerializeResponse,
  SerializationGroups,
} from '../../common/decorators/serialize-response.decorator';
import { DonationSwagger } from './decorators/donation.swagger.decorator';

/**
 * Controller for managing donations
 * Handles both authenticated and anonymous donations
 */
@ApiTags('Donations')
@Controller('donations')
export class DonationController {
  private readonly logger = new Logger(DonationController.name);

  constructor(private readonly donationService: DonationService) {}

  /**
   * Create a donation order (Razorpay)
   * Public endpoint - accessible to both logged-in and anonymous users
   */
  @Post('create-order')
  @Public()
  @DonationSwagger.createDonationOrder()
  async createDonationOrder(
    @Body() createDonationDto: CreateDonationDto,
    @CurrentUser() user?: any,
  ) {
    this.logger.log(
      `Creating donation order for pool: ${createDonationDto.poolId}`,
    );

    const userId = user?.userId;
    return await this.donationService.createDonationOrder(
      createDonationDto,
      userId,
    );
  }

  /**
   * Verify Razorpay payment
   * Public endpoint - called after payment completion
   */
  @Post('verify-payment')
  @Public()
  @DonationSwagger.verifyPayment()
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    this.logger.log(
      `Verifying payment for order: ${verifyPaymentDto.razorpayOrderId}`,
    );
    return await this.donationService.verifyPayment(verifyPaymentDto);
  }

  /**
   * Get all donations with optional filters
   * Admin endpoint
   */
  @Get()
  @ApiBearerAuth()
  @DonationSwagger.getAllDonations()
  @SerializeResponse(SerializationGroups.ADMIN, SerializationGroups.USER)
  async findAll(@Query() filterDto: FilterDonationsDto) {
    return await this.donationService.findAll(filterDto);
  }

  /**
   * Get a specific donation by ID
   * Public endpoint
   */
  @Get(':id')
  @Public()
  @DonationSwagger.getDonationById()
  @SerializeResponse(SerializationGroups.USER)
  async findOne(@Param('id') id: string) {
    return await this.donationService.findOne(id);
  }

  /**
   * Get all donations for a specific pool
   * Public endpoint
   */
  @Get('pool/:poolId')
  @Public()
  @DonationSwagger.getDonationsByPool()
  @SerializeResponse(SerializationGroups.USER)
  async findByPool(@Param('poolId') poolId: string) {
    return await this.donationService.findByPool(poolId);
  }

  /**
   * Get donation statistics for a pool
   * Public endpoint
   */
  @Get('pool/:poolId/stats')
  @Public()
  @DonationSwagger.getPoolDonationStats()
  async getPoolDonationStats(@Param('poolId') poolId: string) {
    return await this.donationService.getPoolDonationStats(poolId);
  }

  /**
   * Get all donations by the current user
   * Authenticated endpoint
   */
  @Get('user/my-donations')
  @ApiBearerAuth()
  @DonationSwagger.getMyDonations()
  @SerializeResponse(SerializationGroups.USER)
  async getMyDonations(@CurrentUser() user: any) {
    return await this.donationService.findByUser(user.userId);
  }
}
