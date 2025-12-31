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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
import {
  SerializeResponse,
  SerializationGroups,
} from '../../common/decorators/serialize-response.decorator';
import { Action } from '../../common/casl/ability.factory';
import { Role } from './role.entity';
import {
  CreateRoleSwagger,
  FindAllRolesSwagger,
  FindOneRoleSwagger,
  UpdateRoleSwagger,
  RemoveRoleSwagger,
  AssignPermissionsSwagger,
  RemovePermissionsSwagger,
} from './decorators/role.swagger.decorator';

/**
 * Role Controller
 * Handles HTTP requests for role management operations
 * Only accessible by users with appropriate permissions
 */
@ApiTags('roles')
@ApiBearerAuth('defaultBearerAuth')
@Controller('roles')
@UseGuards(AuthGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Create a new role
   * POST /roles
   * Requires: superadmin or manage roles permission
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPermissions({ action: Action.CREATE, subject: Role })
  @CreateRoleSwagger()
  @SerializeResponse(SerializationGroups.ADMIN)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  /**
   * Get all roles
   * GET /roles
   * Requires: read roles permission
   */
  @Get()
  @CheckPermissions({ action: Action.READ, subject: Role })
  @FindAllRolesSwagger()
  @SerializeResponse(SerializationGroups.ADMIN, SerializationGroups.USER)
  async findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return await this.roleService.findAll(includeDeleted);
  }

  /**
   * Get role by ID
   * GET /roles/:id
   * Requires: read roles permission
   */
  @Get(':id')
  @CheckPermissions({ action: Action.READ, subject: Role })
  @FindOneRoleSwagger()
  @SerializeResponse(SerializationGroups.ADMIN, SerializationGroups.USER)
  async findOne(@Param('id') id: string) {
    return await this.roleService.findOne(id);
  }

  /**
   * Update role by ID
   * PATCH /roles/:id
   * Requires: update roles permission
   */
  @Patch(':id')
  @CheckPermissions({ action: Action.UPDATE, subject: Role })
  @UpdateRoleSwagger()
  @SerializeResponse(SerializationGroups.ADMIN)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(id, updateRoleDto);
  }

  /**
   * Soft delete role by ID
   * DELETE /roles/:id
   * Requires: delete roles permission
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPermissions({ action: Action.DELETE, subject: Role })
  @RemoveRoleSwagger()
  async remove(@Param('id') id: string) {
    await this.roleService.remove(id);
  }

  /**
   * Restore soft-deleted role by ID
   * PUT /roles/:id/restore
   * Requires: update roles permission
   */
  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  @CheckPermissions({ action: Action.UPDATE, subject: Role })
  async restore(@Param('id') id: string) {
    await this.roleService.restore(id);
    return { message: 'Role restored successfully' };
  }

  /**
   * Assign permissions to a role
   * POST /roles/:id/permissions
   * Requires: manage roles permission
   */
  @Post(':id/permissions')
  @CheckPermissions({ action: Action.UPDATE, subject: Role })
  @AssignPermissionsSwagger()
  @SerializeResponse(SerializationGroups.ADMIN)
  async assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return await this.roleService.assignPermissions(id, assignPermissionsDto);
  }

  /**
   * Remove permissions from a role
   * DELETE /roles/:id/permissions
   * Requires: manage roles permission
   */
  @Delete(':id/permissions')
  @CheckPermissions({ action: Action.UPDATE, subject: Role })
  @RemovePermissionsSwagger()
  @SerializeResponse(SerializationGroups.ADMIN)
  async removePermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return await this.roleService.removePermissions(
      id,
      assignPermissionsDto.permissionIds,
    );
  }
}
