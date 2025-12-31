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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'Price of the pool item',
    example: 99.99,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  poolPrice: number;

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
