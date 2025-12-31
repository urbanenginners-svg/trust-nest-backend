import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SerializationGroups } from '../../common/decorators/serialize-response.decorator';

/**
 * Sample Product Entity
 * Represents a sample product like "Protein Supplements", "Pulses & Lentils", etc.
 */
@Entity('sample_products')
export class SampleProduct {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the sample product' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({
    description: 'Name of the sample product',
    example: 'Protein Supplements',
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Detailed description of the sample product',
    example: 'Nutritional supplements for muscle building and recovery',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  description?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({
    description: 'Sample product code for internal reference',
    example: 'PROT_SUPP',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  code?: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Whether the sample product is active',
    default: true,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the sample product was created' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the sample product was last updated' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @ApiProperty({
    description: 'When the sample product was soft deleted',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  deletedAt?: Date;
}
