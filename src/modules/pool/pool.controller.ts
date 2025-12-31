import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoolService } from './pool.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { PoolSwagger } from './decorators/pool.swagger.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Action } from '../../common/casl/ability.factory';
import {
  SerializeResponse,
  SerializationGroups,
} from '../../common/decorators/serialize-response.decorator';
import { Pool } from './pool.entity';
import { User } from '../user/user.entity';

/**
 * Pool Controller
 * Handles HTTP requests for pool management
 */
@ApiTags('Pools')
@Controller('pools')
@UseGuards(AuthGuard, PermissionsGuard)
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  /**
   * Create a new pool
   */
  @Post()
  @PoolSwagger.Create()
  @CheckPermissions({ action: Action.CREATE, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async create(
    @Body() createPoolDto: CreatePoolDto,
    @CurrentUser() user: User,
  ) {
    return await this.poolService.create(createPoolDto, user.id);
  }

  /**
   * Get all pools
   */
  @Get()
  @PoolSwagger.FindAll()
  @CheckPermissions({ action: Action.READ, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async findAll(
    @Query('includeInactive') includeInactive?: boolean,
    @Query('includeDeleted') includeDeleted?: boolean,
    @Query('includeUnapproved') includeUnapproved?: boolean,
  ) {
    return await this.poolService.findAll(
      includeInactive === true,
      includeDeleted === true,
      includeUnapproved === true,
    );
  }

  /**
   * Get pools by current user
   */
  @Get('my-pools')
  @PoolSwagger.FindByUser()
  @CheckPermissions({ action: Action.READ, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async findMyPools(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: boolean,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return await this.poolService.findByUser(
      user.id,
      includeInactive === true,
      includeDeleted === true,
    );
  }

  /**
   * Get a pool by ID
   */
  @Get(':id')
  @PoolSwagger.FindOne()
  @CheckPermissions({ action: Action.READ, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async findOne(@Param('id') id: string) {
    return await this.poolService.findOne(id);
  }

  /**
   * Update a pool
   */
  @Put(':id')
  @PoolSwagger.Update()
  @CheckPermissions({ action: Action.UPDATE, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async update(
    @Param('id') id: string,
    @Body() updatePoolDto: UpdatePoolDto,
    @CurrentUser() user: User,
  ) {
    return await this.poolService.update(id, updatePoolDto, user.id);
  }

  /**
   * Partially update a pool
   */
  @Patch(':id')
  @PoolSwagger.Update()
  @CheckPermissions({ action: Action.UPDATE, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async partialUpdate(
    @Param('id') id: string,
    @Body() updatePoolDto: UpdatePoolDto,
    @CurrentUser() user: User,
  ) {
    return await this.poolService.update(id, updatePoolDto, user.id);
  }

  /**
   * Soft delete a pool
   */
  @Delete(':id')
  @PoolSwagger.Remove()
  @CheckPermissions({ action: Action.DELETE, subject: Pool })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.poolService.remove(id, user.id);
  }

  /**
   * Hard delete a pool (admin only)
   */
  @Delete(':id/hard')
  @PoolSwagger.HardDelete()
  @CheckPermissions({ action: Action.MANAGE, subject: Pool })
  async hardDelete(@Param('id') id: string) {
    return await this.poolService.hardDelete(id);
  }

  /**
   * Restore a soft-deleted pool (admin only)
   */
  @Put(':id/restore')
  @PoolSwagger.Restore()
  @CheckPermissions({ action: Action.MANAGE, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async restore(@Param('id') id: string) {
    return await this.poolService.restore(id);
  }

  /**
   * Approve a pool (admin only)
   */
  @Put(':id/approve')
  @PoolSwagger.Approve()
  @CheckPermissions({ action: Action.MANAGE, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async approve(@Param('id') id: string) {
    return await this.poolService.approve(id);
  }

  /**
   * Reject/Unapprove a pool (admin only)
   */
  @Put(':id/reject')
  @PoolSwagger.Reject()
  @CheckPermissions({ action: Action.MANAGE, subject: Pool })
  @SerializeResponse(SerializationGroups.USER)
  async reject(@Param('id') id: string) {
    return await this.poolService.reject(id);
  }
}
