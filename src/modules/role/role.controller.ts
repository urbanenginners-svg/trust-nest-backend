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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
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
  async findAll() {
    return await this.roleService.findAll();
  }

  /**
   * Get role by ID
   * GET /roles/:id
   * Requires: read roles permission
   */
  @Get(':id')
  @CheckPermissions({ action: Action.READ, subject: Role })
  @FindOneRoleSwagger()
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
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(id, updateRoleDto);
  }

  /**
   * Delete role by ID
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
   * Assign permissions to a role
   * POST /roles/:id/permissions
   * Requires: manage roles permission
   */
  @Post(':id/permissions')
  @CheckPermissions({ action: Action.UPDATE, subject: Role })
  @AssignPermissionsSwagger()
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
