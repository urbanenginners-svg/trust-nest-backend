import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * User Controller
 * Handles HTTP requests for user-related operations
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * POST /users
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  /**
   * Get all users
   * GET /users
   */
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  /**
   * Get user by ID
   * GET /users/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  /**
   * Update user by ID
   * PATCH /users/:id
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  /**
   * Delete user by ID
   * DELETE /users/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
