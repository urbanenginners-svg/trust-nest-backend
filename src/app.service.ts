import { Injectable } from '@nestjs/common';

/**
 * Application Root Service
 * Provides basic application-level functionality
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to NestJS PostgreSQL API';
  }
}
