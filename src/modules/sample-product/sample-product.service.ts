import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleProduct } from './sample-product.entity';
import { CreateSampleProductDto } from './dto/create-sample-product.dto';
import { UpdateSampleProductDto } from './dto/update-sample-product.dto';

/**
 * Service for managing sample products
 * Handles CRUD operations for sample products
 */
@Injectable()
export class SampleProductService {
  constructor(
    @InjectRepository(SampleProduct)
    private readonly sampleProductRepository: Repository<SampleProduct>,
  ) {}

  /**
   * Create a new sample product
   * @param createSampleProductDto - Sample product data
   * @returns Created sample product
   */
  async create(
    createSampleProductDto: CreateSampleProductDto,
  ): Promise<SampleProduct> {
    // Check if a sample product with the same name already exists (exclude soft-deleted)
    const existingProduct = await this.sampleProductRepository.findOne({
      where: { name: createSampleProductDto.name },
      withDeleted: false,
    });

    if (existingProduct) {
      throw new ConflictException(
        `Sample product with name "${createSampleProductDto.name}" already exists`,
      );
    }

    // Check if code is provided and already exists (exclude soft-deleted)
    if (createSampleProductDto.code) {
      const existingCode = await this.sampleProductRepository.findOne({
        where: { code: createSampleProductDto.code },
        withDeleted: false,
      });

      if (existingCode) {
        throw new ConflictException(
          `Sample product with code "${createSampleProductDto.code}" already exists`,
        );
      }
    }

    const sampleProduct = this.sampleProductRepository.create(
      createSampleProductDto,
    );
    return await this.sampleProductRepository.save(sampleProduct);
  }

  /**
   * Get all sample products
   * @param includeInactive - Whether to include inactive products
   * @param includeDeleted - Whether to include soft-deleted products
   * @returns Array of sample products
   */
  async findAll(includeInactive: boolean = false, includeDeleted: boolean = false): Promise<SampleProduct[]> {
    const queryBuilder =
      this.sampleProductRepository.createQueryBuilder('product');

    if (!includeInactive) {
      queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });
    }

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    return await queryBuilder.orderBy('product.name', 'ASC').getMany();
  }

  /**
   * Get a sample product by ID
   * @param id - Sample product ID
   * @param includeDeleted - Whether to include soft-deleted products
   * @returns Sample product
   */
  async findOne(id: string, includeDeleted: boolean = false): Promise<SampleProduct> {
    const options: any = { where: { id } };
    if (includeDeleted) {
      options.withDeleted = true;
    }

    const sampleProduct = await this.sampleProductRepository.findOne(options);

    if (!sampleProduct) {
      throw new NotFoundException(`Sample product with ID "${id}" not found`);
    }

    return sampleProduct;
  }

  /**
   * Update a sample product
   * @param id - Sample product ID
   * @param updateSampleProductDto - Updated sample product data
   * @returns Updated sample product
   */
  async update(
    id: string,
    updateSampleProductDto: UpdateSampleProductDto,
  ): Promise<SampleProduct> {
    const sampleProduct = await this.findOne(id);

    // Check for name conflicts (excluding current product and soft-deleted)
    if (
      updateSampleProductDto.name &&
      updateSampleProductDto.name !== sampleProduct.name
    ) {
      const existingName = await this.sampleProductRepository.findOne({
        where: { name: updateSampleProductDto.name },
        withDeleted: false,
      });

      if (existingName) {
        throw new ConflictException(
          `Sample product with name "${updateSampleProductDto.name}" already exists`,
        );
      }
    }

    // Check for code conflicts (excluding current product and soft-deleted)
    if (
      updateSampleProductDto.code &&
      updateSampleProductDto.code !== sampleProduct.code
    ) {
      const existingCode = await this.sampleProductRepository.findOne({
        where: { code: updateSampleProductDto.code },
        withDeleted: false,
      });

      if (existingCode) {
        throw new ConflictException(
          `Sample product with code "${updateSampleProductDto.code}" already exists`,
        );
      }
    }

    Object.assign(sampleProduct, updateSampleProductDto);
    return await this.sampleProductRepository.save(sampleProduct);
  }

  /**
   * Soft delete a sample product
   * @param id - Sample product ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.sampleProductRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Sample product with ID "${id}" not found`);
    }
  }

  /**
   * Restore a soft-deleted sample product
   * @param id - Sample product ID
   */
  async restore(id: string): Promise<void> {
    const result = await this.sampleProductRepository.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Sample product with ID "${id}" not found or not deleted`);
    }
  }
}
