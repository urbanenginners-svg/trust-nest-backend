import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Permission } from '../permission/permission.entity';
import { SerializationGroups } from '../../common/decorators/serialize-response.decorator';

/**
 * Role Entity
 * Represents system roles with associated permissions
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the role' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty({ description: 'Name of the role' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Description of the role' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  description: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether the role is active' })
  @Expose({ groups: ['admin'] })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the role was created' })
  @Expose({ groups: ['admin'] })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the role was last updated' })
  @Expose({ groups: ['admin'] })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'When the role was soft deleted', required: false })
  @Expose({ groups: ['admin'] })
  deletedAt?: Date;

  // Many-to-many relationship with Users
  @ManyToMany(() => User, (user) => user.roles)
  @ApiProperty({
    description: 'Users assigned to this role',
    type: () => [User],
  })
  @Expose({ groups: ['admin'] })
  @Transform(
    ({ value }) =>
      value?.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })) || [],
  )
  users: User[];

  // Many-to-many relationship with Permissions
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  @ApiProperty({
    description: 'Permissions assigned to this role',
    type: () => [Permission],
  })
  @Expose({ groups: ['admin', 'user'] })
  @Transform(
    ({ value }) =>
      value?.map((permission) => ({
        id: permission.id,
        name: permission.name,
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      })) || [],
  )
  permissions: Permission[];
}
