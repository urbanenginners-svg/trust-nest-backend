import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Role } from './role.entity';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Check if role name already exists
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists`,
      );
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(includeDeleted: boolean = false): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['permissions'],
      order: { createdAt: 'DESC' },
      withDeleted: includeDeleted,
    });
  }

  async findOne(id: string, includeDeleted: boolean = false): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
      withDeleted: includeDeleted,
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.findOne(id); // Ensures role exists

    // Check for name conflict if name is being updated
    if (updateRoleDto.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(
          `Role with name '${updateRoleDto.name}' already exists`,
        );
      }
    }

    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id); // Ensures role exists

    // Prevent deletion of superadmin role
    if (role.name === 'superadmin') {
      throw new ConflictException('Cannot delete superadmin role');
    }

    await this.roleRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const role = await this.findOne(id, true); // Ensures role exists (including deleted)
    await this.roleRepository.restore(id);
  }

  async assignPermissions(
    id: string,
    assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Role> {
    const role = await this.findOne(id); // Ensures role exists

    // Find all permissions by IDs
    const permissions = await this.permissionRepository.findByIds(
      assignPermissionsDto.permissionIds,
    );

    if (permissions.length !== assignPermissionsDto.permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // Assign permissions to role
    role.permissions = permissions;
    await this.roleRepository.save(role);

    return this.findOne(id);
  }

  async removePermissions(id: string, permissionIds: string[]): Promise<Role> {
    const role = await this.findOne(id); // Ensures role exists

    // Filter out the permissions to remove
    role.permissions = role.permissions.filter(
      (permission) => !permissionIds.includes(permission.id),
    );

    await this.roleRepository.save(role);
    return this.findOne(id);
  }
}
