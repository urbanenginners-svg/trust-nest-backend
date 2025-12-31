import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../modules/user/user.entity';

/**
 * Auth Controller
 * Handles authentication and authorization endpoints
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * User login
   * POST /auth/login
   */
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        token_type: { type: 'string', example: 'Bearer' },
        expires_in: { type: 'number', example: 3600 },
        user: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * Get current user profile
   * GET /auth/profile
   */
  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getProfile(@Request() req) {
    // User is already attached to request by JWT strategy
    const { password, ...userProfile } = req.user;
    return userProfile;
  }

  /**
   * Get superadmin user for testing (temporary endpoint)
   * GET /auth/superadmin
   */
  @Get('superadmin')
  @ApiOperation({ summary: 'Get superadmin credentials for testing' })
  @ApiResponse({ status: 200, description: 'Superadmin credentials' })
  async getSuperAdmin() {
    const superAdmin = await this.userRepository.findOne({
      where: { email: 'superadmin@example.com' },
      relations: ['roles', 'roles.permissions'],
      select: ['id', 'name', 'email', 'isActive', 'createdAt'],
    });

    return {
      user: superAdmin,
      instructions: {
        message: 'Use the login endpoint to get JWT token',
        credentials: {
          email: 'superadmin@example.com',
          password: 'SuperAdmin123!',
        },
        usage: {
          step1: 'POST /auth/login with above credentials',
          step2: 'Copy the access_token from response',
          step3: 'Add Authorization header: Bearer {access_token}',
        },
      },
    };
  }
}
