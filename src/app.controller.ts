import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Application Root Controller
 * Provides health check and basic application endpoints
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check endpoint
   * GET /health
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
