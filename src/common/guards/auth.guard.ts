import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Uses Passport JWT strategy to validate Bearer tokens
 */
@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {}
