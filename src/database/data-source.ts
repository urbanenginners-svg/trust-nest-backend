import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * DataSource configuration for TypeORM CLI
 * This file is used for running migrations via CLI commands
 *
 * IMPORTANT: This is separate from the NestJS TypeORM module configuration
 * but should maintain the same settings for consistency
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Entity paths - use compiled JS files for migrations
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  // Migration configuration
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',

  // NEVER set synchronize to true when using migrations
  synchronize: false,

  // Enable logging for debugging migration issues
  logging:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn', 'migration']
      : ['error', 'migration'],

  // SSL configuration
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

// Initialize DataSource (required for TypeORM CLI)
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
