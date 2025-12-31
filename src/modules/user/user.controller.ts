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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateUserSwagger,
  FindAllUsersSwagger,
  FindOneUserSwagger,
  UpdateUserSwagger,
  RemoveUserSwagger,
} from './decorators/user.swagger.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
import { Action } from '../../common/casl/ability.factory';
import { User } from './user.entity';

/**
 * User Controller
 * Handles HTTP requests for user-related operations
 */
@ApiTags('users')
@ApiBearerAuth('defaultBearerAuth')
@Controller('users')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * POST /users
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPermissions({ action: Action.CREATE, subject: User })
  @CreateUserSwagger()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  /**
   * Get all users
   * GET /users
   */
  @Get()
  @CheckPermissions({ action: Action.READ, subject: User })
  @FindAllUsersSwagger()
  async findAll() {
    return await this.userService.findAll();
  }

  /**
   * Get user by ID
   * GET /users/:id
   */
  @Get(':id')
  @CheckPermissions({ action: Action.READ, subject: User })
  @FindOneUserSwagger()
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  /**
   * Update user by ID
   * PATCH /users/:id
   */
  @Patch(':id')
  @CheckPermissions({ action: Action.UPDATE, subject: User })
  @UpdateUserSwagger()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  /**
   * Delete user by ID
   * DELETE /users/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPermissions({ action: Action.DELETE, subject: User })
  @RemoveUserSwagger()
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
