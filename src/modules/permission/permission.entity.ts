import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Role } from '../role/role.entity';
import { SerializationGroups } from '../../common/decorators/serialize-response.decorator';

/**
 * Permission Entity
 * Represents system permissions that can be assigned to roles
 */
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the permission' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty({ description: 'Name of the permission' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'Resource this permission applies to' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  resource: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: 'Action this permission allows' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  action: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Description of the permission' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  description: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether the permission is active' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the permission was created' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the permission was last updated' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'When the permission was soft deleted', required: false })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  deletedAt?: Date;

  // Many-to-many relationship with Roles
  @ManyToMany(() => Role, (role) => role.permissions)
  @ApiProperty({
    description: 'Roles that have this permission',
    type: () => [Role],
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  @Transform(
    ({ value }) =>
      value?.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })) || [],
  )
  roles: Role[];
}
