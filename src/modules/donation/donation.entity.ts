import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SerializationGroups } from '../../common/decorators/serialize-response.decorator';
import { Pool } from '../pool/pool.entity';
import { User } from '../user/user.entity';
import { DonationStatus } from './enums/donation-status.enum';

/**
 * Donation Entity
 * Represents a donation made to a pool by either a logged-in user or an anonymous donor
 */
@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the donation' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'Amount donated',
    example: 50.0,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  amount: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Optional message from the donor',
    example: 'Hope this helps!',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  message?: string;

  @Column({
    type: 'enum',
    enum: DonationStatus,
    default: DonationStatus.PENDING,
  })
  @ApiProperty({
    description: 'Current status of the donation',
    enum: DonationStatus,
    example: DonationStatus.PENDING,
    default: DonationStatus.PENDING,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  status: DonationStatus;

  // Razorpay payment fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Razorpay order ID',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  razorpayOrderId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Razorpay payment ID',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  razorpayPaymentId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Razorpay signature for verification',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  razorpaySignature?: string;

  // Donor information for anonymous users
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Name of anonymous donor',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  anonymousDonorName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Email of anonymous donor',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  anonymousDonorEmail?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({
    description: 'Phone number of anonymous donor',
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  anonymousDonorPhone?: string;

  // Relations
  @ManyToOne(() => Pool, { eager: true })
  @JoinColumn({ name: 'pool_id' })
  @ApiProperty({
    description: 'Pool reference',
    type: () => Pool,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  pool: Pool;

  @Column({ name: 'pool_id' })
  @ApiProperty({ description: 'Pool ID reference' })
  poolId: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'User who made the donation (null for anonymous donations)',
    type: () => User,
    required: false,
  })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  user?: User;

  @Column({ name: 'user_id', nullable: true })
  @ApiProperty({
    description: 'User ID who made the donation (null for anonymous donations)',
    required: false,
  })
  userId?: string;

  // Timestamps
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the donation was created' })
  @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'When the donation was last updated' })
  @Expose({ groups: [SerializationGroups.ADMIN] })
  updatedAt: Date;
}
