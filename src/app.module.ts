import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config/env.validation';
import { getDatabaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';

/**
 * Root Application Module
 * Imports all feature modules and configures global settings
 */
@Module({
  imports: [
    // Configuration Module - must be first
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available everywhere
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load environment-specific .env file
      validate, // Validate environment variables on startup
      cache: true, // Cache environment variables for performance
    }),

    // TypeORM Database Module - async configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    // Feature Modules
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
