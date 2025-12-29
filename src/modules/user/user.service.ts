import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * User Service
 * Handles all business logic related to user operations
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   * @param createUserDto - User creation data
   * @returns Created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Get all users
   * @returns Array of users
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User entity
   * @throws NotFoundException if user not found
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User entity or null
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Update user information
   * @param id - User ID
   * @param updateUserDto - User update data
   * @returns Updated user
   * @throws NotFoundException if user not found
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns void
   * @throws NotFoundException if user not found
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
