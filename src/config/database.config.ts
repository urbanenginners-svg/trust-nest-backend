import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database configuration factory for TypeORM
 * Supports multiple environments: development, staging, production
 * Uses environment variables for all sensitive data
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  const isDevelopment = configService.get('NODE_ENV') === 'development';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),

    // Entity paths
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],

    // Migration settings
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: false, // Don't auto-run migrations, use CLI

    // IMPORTANT: Never use synchronize in production
    synchronize: false,

    // Logging configuration
    logging: isDevelopment ? ['query', 'error', 'warn'] : ['error'],

    // Connection pool settings for production
    extra: {
      max: isProduction ? 20 : 10, // Maximum pool size
      min: isProduction ? 5 : 2, // Minimum pool size
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection cannot be established
    },

    // SSL configuration for production
    ssl: isProduction
      ? {
          rejectUnauthorized: false, // Set to true if using proper SSL certificates
        }
      : false,

    // Automatic retries on connection failure
    retryAttempts: 3,
    retryDelay: 3000,
  };
};
