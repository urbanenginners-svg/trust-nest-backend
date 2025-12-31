import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Role } from '../role/role.entity';
import { SerializationGroups } from '../../common/decorators/serialize-response.decorator';

/**
 * User Entity
 * Represents a user in the system with authentication and profile information
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the user' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Full name of the user' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ description: 'Email address of the user' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiHideProperty() // Never expose password in API responses
  @Exclude() // Always exclude password from serialization
  password: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether the user account is active' })
  @Expose({ groups: ['admin'] })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the user was created' })
  @Expose({ groups: ['admin'] })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the user was last updated' })
  @Expose({ groups: ['admin'] })
  updatedAt: Date;

  // Many-to-many relationship with Roles
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  @ApiProperty({
    description: 'Roles assigned to the user',
    type: () => [Role],
  })
  @Expose({ groups: ['admin', 'user'] })
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
