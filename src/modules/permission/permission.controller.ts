import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreatePermissionSwagger,
  FindAllPermissionsSwagger,
  FindOnePermissionSwagger,
  UpdatePermissionSwagger,
  RemovePermissionSwagger,
} from './decorators/permission.swagger.decorator';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
import { Action } from '../../common/casl/ability.factory';
import { Permission } from './permission.entity';

/**
 * Permission Controller
 * Handles HTTP requests for permission management operations
 * Only accessible by users with appropriate permissions
 */
@ApiTags('permissions')
@ApiBearerAuth('defaultBearerAuth')
@Controller('permissions')
@UseGuards(AuthGuard, PermissionsGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Create a new permission
   * POST /permissions
   * Requires: superadmin or manage permissions permission
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPermissions({ action: Action.CREATE, subject: Permission })
  @CreatePermissionSwagger()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto);
  }

  /**
   * Get all permissions
   * GET /permissions
   * Requires: read permissions permission
   */
  @Get()
  @CheckPermissions({ action: Action.READ, subject: Permission })
  @FindAllPermissionsSwagger()
  async findAll(
    @Query('resource') resource?: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    if (resource) {
      return await this.permissionService.findByResource(resource);
    }
    return await this.permissionService.findAll(includeDeleted);
  }

  /**
   * Get permission by ID
   * GET /permissions/:id
   * Requires: read permissions permission
   */
  @Get(':id')
  @CheckPermissions({ action: Action.READ, subject: Permission })
  @FindOnePermissionSwagger()
  async findOne(@Param('id') id: string) {
    return await this.permissionService.findOne(id);
  }

  /**
   * Update permission by ID
   * PATCH /permissions/:id
   * Requires: update permissions permission
   */
  @Patch(':id')
  @CheckPermissions({ action: Action.UPDATE, subject: Permission })
  @UpdatePermissionSwagger()
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.update(id, updatePermissionDto);
  }

  /**
   * Soft delete permission by ID
   * DELETE /permissions/:id
   * Requires: delete permissions permission
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPermissions({ action: Action.DELETE, subject: Permission })
  @RemovePermissionSwagger()
  async remove(@Param('id') id: string) {
    await this.permissionService.remove(id);
  }

  /**
   * Restore soft-deleted permission by ID
   * PUT /permissions/:id/restore
   * Requires: update permissions permission
   */
  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  @CheckPermissions({ action: Action.UPDATE, subject: Permission })
  async restore(@Param('id') id: string) {
    await this.permissionService.restore(id);
    return { message: 'Permission restored successfully' };
  }
}
