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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
import { Action } from '../../common/casl/ability.factory';
import { Role } from './role.entity';

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
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - role name already exists',
  })
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
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all roles with permissions',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
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
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Role found with permissions and users',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
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
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Role successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - role name already exists',
  })
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
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 204, description: 'Role successfully deleted' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - cannot delete superadmin role',
  })
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
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions successfully assigned to role',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Role or permissions not found' })
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
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions successfully removed from role',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
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
