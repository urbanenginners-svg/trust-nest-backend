import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // Check if permission name already exists
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existingPermission) {
      throw new ConflictException(
        `Permission with name '${createPermissionDto.name}' already exists`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll(includeDeleted: boolean = false): Promise<Permission[]> {
    return await this.permissionRepository.find({
      order: { resource: 'ASC', action: 'ASC' },
      withDeleted: includeDeleted,
    });
  }

  async findOne(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
      withDeleted: includeDeleted,
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    await this.findOne(id); // Ensures permission exists

    // Check for name conflict if name is being updated
    if (updatePermissionDto.name) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name },
      });

      if (existingPermission && existingPermission.id !== id) {
        throw new ConflictException(
          `Permission with name '${updatePermissionDto.name}' already exists`,
        );
      }
    }

    await this.permissionRepository.update(id, updatePermissionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensures permission exists
    await this.permissionRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.findOne(id, true); // Ensures permission exists (including deleted)
    await this.permissionRepository.restore(id);
  }

  /**
   * Get permissions by resource
   */
  async findByResource(resource: string): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: { resource, isActive: true },
      order: { action: 'ASC' },
    });
  }

  /**
   * Bulk create permissions - useful for seeding
   */
  async bulkCreate(permissions: CreatePermissionDto[]): Promise<Permission[]> {
    const entities = this.permissionRepository.create(permissions);
    return await this.permissionRepository.save(entities);
  }
}
