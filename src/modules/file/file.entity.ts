import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { SerializationGroups } from '../../common/decorators/serialize-response.decorator';

/**
 * Enum for file module names based on project entities
 */
export enum FileModuleName {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  FILE = 'file',
  SAMPLE_PRODUCT = 'sample-product',
  GENERAL = 'general',
}

/**
 * File Entity
 * Represents uploaded files in the system
 */
@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the file' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  id: string;

  @Column({ type: 'varchar', length: 500 })
  @ApiProperty({ description: 'Original name of the uploaded file' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  fileName: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'MIME type of the file' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  fileType: string;

  @Column({ type: 'bigint' })
  @ApiProperty({ description: 'Size of the file in bytes' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  fileSize: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the file was uploaded' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  uploadDate: Date;

  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'ID of the user who uploaded the file' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  uploaderId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'uploaderId' })
  @ApiProperty({ description: 'User who uploaded the file', type: () => User })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  uploader: User;

  @Column({ type: 'varchar', length: 1000 })
  @ApiProperty({ description: 'Server path where the file is stored' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  filePath: string;

  @Column({
    type: 'enum',
    enum: FileModuleName,
    default: FileModuleName.GENERAL,
  })
  @ApiProperty({
    description: 'Module/context the file is related to',
    enum: FileModuleName,
    example: FileModuleName.USER,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  moduleName: FileModuleName;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Whether the file has been soft deleted' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  isDeleted: boolean;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the file was last updated' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  updatedAt: Date;
}
