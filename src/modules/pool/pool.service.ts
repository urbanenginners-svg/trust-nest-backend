import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from './pool.entity';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { SampleProduct } from '../sample-product/sample-product.entity';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';

/**
 * Service for managing pools
 * Handles CRUD operations for pools
 */
@Injectable()
export class PoolService {
  constructor(
    @InjectRepository(Pool)
    private readonly poolRepository: Repository<Pool>,
    @InjectRepository(SampleProduct)
    private readonly sampleProductRepository: Repository<SampleProduct>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new pool
   * @param createPoolDto - Pool data
   * @param userId - ID of user creating the pool
   * @returns Created pool
   */
  async create(createPoolDto: CreatePoolDto, userId: string): Promise<Pool> {
    // Validate category exists and is active
    const category = await this.sampleProductRepository.findOne({
      where: { id: createPoolDto.categoryId, isActive: true },
      withDeleted: false,
    });

    if (!category) {
      throw new NotFoundException(
        `Sample product category with ID "${createPoolDto.categoryId}" not found or inactive`,
      );
    }

    // Validate sample image exists if provided
    if (createPoolDto.sampleImageId) {
      const sampleImage = await this.fileRepository.findOne({
        where: { id: createPoolDto.sampleImageId },
      });

      if (!sampleImage) {
        throw new NotFoundException(
          `File with ID "${createPoolDto.sampleImageId}" not found`,
        );
      }
    }

    // Validate user exists
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      withDeleted: false,
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Check if a pool with the same batch number already exists for this category
    const existingPool = await this.poolRepository.findOne({
      where: {
        batchNumber: createPoolDto.batchNumber,
        categoryId: createPoolDto.categoryId,
      },
      withDeleted: false,
    });

    if (existingPool) {
      throw new ConflictException(
        `Pool with batch number "${createPoolDto.batchNumber}" already exists for this category`,
      );
    }

    const pool = this.poolRepository.create({
      ...createPoolDto,
      userId,
    });

    return await this.poolRepository.save(pool);
  }

  /**
   * Get all pools
   * @param includeInactive - Whether to include inactive pools
   * @param includeDeleted - Whether to include soft-deleted pools
   * @param includeUnapproved - Whether to include unapproved pools
   * @returns Array of pools
   */
  async findAll(
    includeInactive: boolean = false,
    includeDeleted: boolean = false,
    includeUnapproved: boolean = false,
  ): Promise<Pool[]> {
    const queryBuilder = this.poolRepository
      .createQueryBuilder('pool')
      .leftJoinAndSelect('pool.category', 'category')
      .leftJoinAndSelect('pool.sampleImage', 'sampleImage')
      .leftJoinAndSelect('pool.user', 'user');

    if (!includeInactive) {
      queryBuilder.andWhere('pool.isActive = :isActive', { isActive: true });
    }

    if (!includeUnapproved) {
      queryBuilder.andWhere('pool.isApproved = :isApproved', {
        isApproved: true,
      });
    }

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    return await queryBuilder.getMany();
  }

  /**
   * Get pools by user
   * @param userId - User ID to filter by
   * @param includeInactive - Whether to include inactive pools
   * @param includeDeleted - Whether to include soft-deleted pools
   * @returns Array of user's pools
   */
  async findByUser(
    userId: string,
    includeInactive: boolean = false,
    includeDeleted: boolean = false,
  ): Promise<Pool[]> {
    const queryBuilder = this.poolRepository
      .createQueryBuilder('pool')
      .leftJoinAndSelect('pool.category', 'category')
      .leftJoinAndSelect('pool.sampleImage', 'sampleImage')
      .leftJoinAndSelect('pool.user', 'user')
      .where('pool.userId = :userId', { userId });

    if (!includeInactive) {
      queryBuilder.andWhere('pool.isActive = :isActive', { isActive: true });
    }

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    return await queryBuilder.getMany();
  }

  /**
   * Get a single pool by ID
   * @param id - Pool ID
   * @param includeDeleted - Whether to include soft-deleted pools
   * @returns Pool entity
   */
  async findOne(id: string, includeDeleted: boolean = false): Promise<Pool> {
    const queryBuilder = this.poolRepository
      .createQueryBuilder('pool')
      .leftJoinAndSelect('pool.category', 'category')
      .leftJoinAndSelect('pool.sampleImage', 'sampleImage')
      .leftJoinAndSelect('pool.user', 'user')
      .where('pool.id = :id', { id });

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    const pool = await queryBuilder.getOne();

    if (!pool) {
      throw new NotFoundException(`Pool with ID "${id}" not found`);
    }

    return pool;
  }

  /**
   * Update a pool
   * @param id - Pool ID
   * @param updatePoolDto - Pool update data
   * @param userId - ID of user performing the update
   * @returns Updated pool
   */
  async update(
    id: string,
    updatePoolDto: UpdatePoolDto,
    userId: string,
  ): Promise<Pool> {
    const pool = await this.findOne(id);

    // Check if user owns the pool or is admin (this should be handled by permissions)
    if (pool.userId !== userId) {
      throw new ForbiddenException(
        'You can only update pools that you created',
      );
    }

    // Validate category if being updated
    if (updatePoolDto.categoryId) {
      const category = await this.sampleProductRepository.findOne({
        where: { id: updatePoolDto.categoryId, isActive: true },
        withDeleted: false,
      });

      if (!category) {
        throw new NotFoundException(
          `Sample product category with ID "${updatePoolDto.categoryId}" not found or inactive`,
        );
      }
    }

    // Validate sample image if being updated
    if (updatePoolDto.sampleImageId !== undefined) {
      if (updatePoolDto.sampleImageId) {
        const sampleImage = await this.fileRepository.findOne({
          where: { id: updatePoolDto.sampleImageId },
        });

        if (!sampleImage) {
          throw new NotFoundException(
            `File with ID "${updatePoolDto.sampleImageId}" not found`,
          );
        }
      }
    }

    // Check for batch number conflicts if being updated
    if (updatePoolDto.batchNumber) {
      const categoryId = updatePoolDto.categoryId || pool.categoryId;
      const existingPool = await this.poolRepository.findOne({
        where: {
          batchNumber: updatePoolDto.batchNumber,
          categoryId: categoryId,
        },
        withDeleted: false,
      });

      if (existingPool && existingPool.id !== id) {
        throw new ConflictException(
          `Pool with batch number "${updatePoolDto.batchNumber}" already exists for this category`,
        );
      }
    }

    await this.poolRepository.update(id, updatePoolDto);
    return await this.findOne(id);
  }

  /**
   * Soft delete a pool
   * @param id - Pool ID
   * @param userId - ID of user performing the deletion
   * @returns Success message
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const pool = await this.findOne(id);

    // Check if user owns the pool (this should be handled by permissions)
    if (pool.userId !== userId) {
      throw new ForbiddenException(
        'You can only delete pools that you created',
      );
    }

    await this.poolRepository.softDelete(id);
    return { message: `Pool with ID "${id}" has been deleted` };
  }

  /**
   * Hard delete a pool (admin only)
   * @param id - Pool ID
   * @returns Success message
   */
  async hardDelete(id: string): Promise<{ message: string }> {
    const pool = await this.findOne(id, true);
    await this.poolRepository.remove(pool);
    return { message: `Pool with ID "${id}" has been permanently deleted` };
  }

  /**
   * Restore a soft-deleted pool
   * @param id - Pool ID
   * @returns Restored pool
   */
  async restore(id: string): Promise<Pool> {
    await this.poolRepository.restore(id);
    return await this.findOne(id);
  }

  /**
   * Approve a pool (admin only)
   * @param id - Pool ID
   * @returns Updated pool
   */
  async approve(id: string): Promise<Pool> {
    const pool = await this.findOne(id);
    await this.poolRepository.update(id, { isApproved: true });
    return await this.findOne(id);
  }

  /**
   * Reject/Unapprove a pool (admin only)
   * @param id - Pool ID
   * @returns Updated pool
   */
  async reject(id: string): Promise<Pool> {
    const pool = await this.findOne(id);
    await this.poolRepository.update(id, { isApproved: false });
    return await this.findOne(id);
  }
}
