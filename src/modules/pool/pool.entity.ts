import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SerializationGroups } from '../../common/decorators/serialize-response.decorator';
import { SampleProduct } from '../sample-product/sample-product.entity';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';
import { PoolStatus } from './enums/pool-status.enum';

/**
 * Pool Entity
 * Represents a pool item with sample information and pricing
 */
@Entity('pools')
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the pool' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    description: 'Name of the pool item',
    example: 'Premium Whey Protein Sample',
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    description: 'Source of the sample',
    example: 'Lab Testing Facility A',
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  sampleSource: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({
    description: 'Batch number for tracking',
    example: 'BATCH-001-2024',
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  batchNumber: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Detailed description of the pool item',
    example: 'High-quality protein sample for laboratory analysis',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  description?: string;

  @Column({
    type: 'enum',
    enum: PoolStatus,
    default: PoolStatus.CREATED,
  })
  @ApiProperty({
    description: 'Current status of the pool',
    enum: PoolStatus,
    example: PoolStatus.CREATED,
    default: PoolStatus.CREATED,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  status: PoolStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty({
    description: 'Price of the pool item (set by admin during approval)',
    example: 99.99,
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  poolPrice?: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({
    description: 'Total number of contributors to this pool',
    example: 25,
    default: 0,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  totalContributors: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({
    description: 'Total amount received from contributors',
    example: 150.75,
    default: 0,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  amountReceived: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Whether the pool item is active',
    default: true,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: 'Whether the pool item is approved',
    default: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  isApproved: boolean;

  // Relations
  @ManyToOne(() => SampleProduct, { eager: true })
  @JoinColumn({ name: 'category_id' })
  @ApiProperty({
    description: 'Category reference to sample product',
    type: () => SampleProduct,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  category: SampleProduct;

  @Column({ name: 'category_id' })
  @ApiProperty({ description: 'Category ID reference' })
  categoryId: string;

  @ManyToOne(() => File, { eager: true, nullable: true })
  @JoinColumn({ name: 'sample_image_id' })
  @ApiProperty({
    description: 'Sample image file',
    type: () => File,
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  sampleImage?: File;

  @Column({ name: 'sample_image_id', nullable: true })
  @ApiProperty({ description: 'Sample image ID reference', required: false })
  sampleImageId?: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'User who created the pool',
    type: () => User,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  user: User;

  @Column({ name: 'user_id' })
  @ApiProperty({ description: 'User ID who created the pool' })
  userId: string;

  // Timestamps
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the pool was created' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the pool was last updated' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @ApiProperty({
    description: 'When the pool was soft deleted',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  deletedAt?: Date;
}
