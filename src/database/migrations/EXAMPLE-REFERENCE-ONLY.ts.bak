import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * EXAMPLE MIGRATION FILE
 *
 * This is an example of what a generated migration looks like.
 * DO NOT run this file - it's for reference only.
 *
 * Real migrations are generated with:
 * npm run migration:generate -- src/database/migrations/YourMigrationName
 *
 * This file shows:
 * - How TypeORM generates SQL from entities
 * - The structure of up() and down() methods
 * - How to handle rollbacks
 */

export class ExampleCreateUserTable1234567890 implements MigrationInterface {
  name = 'ExampleCreateUserTable1234567890';

  /**
   * up() - Runs when applying the migration
   * This creates the users table
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);

    // Create index for better performance
    await queryRunner.query(`
            CREATE INDEX "IDX_user_email" ON "users" ("email")
        `);
  }

  /**
   * down() - Runs when reverting the migration
   * This drops the users table
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);

    // Then drop table
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

/**
 * MIGRATION PATTERNS
 *
 * 1. Adding a Column:
 *
 * up():
 *   await queryRunner.query(`
 *     ALTER TABLE "users"
 *     ADD "phoneNumber" character varying
 *   `);
 *
 * down():
 *   await queryRunner.query(`
 *     ALTER TABLE "users"
 *     DROP COLUMN "phoneNumber"
 *   `);
 *
 *
 * 2. Creating an Index:
 *
 * up():
 *   await queryRunner.query(`
 *     CREATE INDEX "IDX_users_name"
 *     ON "users" ("name")
 *   `);
 *
 * down():
 *   await queryRunner.query(`
 *     DROP INDEX "IDX_users_name"
 *   `);
 *
 *
 * 3. Adding a Foreign Key:
 *
 * up():
 *   await queryRunner.query(`
 *     ALTER TABLE "posts"
 *     ADD CONSTRAINT "FK_posts_authorId"
 *     FOREIGN KEY ("authorId")
 *     REFERENCES "users"("id")
 *     ON DELETE CASCADE
 *   `);
 *
 * down():
 *   await queryRunner.query(`
 *     ALTER TABLE "posts"
 *     DROP CONSTRAINT "FK_posts_authorId"
 *   `);
 *
 *
 * 4. Data Migration (Custom):
 *
 * up():
 *   await queryRunner.query(`
 *     UPDATE "users"
 *     SET "role" = 'user'
 *     WHERE "role" IS NULL
 *   `);
 *
 * down():
 *   // Usually not reversible for data migrations
 *   // Document this in comments
 *
 *
 * IMPORTANT NOTES:
 *
 * - Always implement both up() and down()
 * - Test migrations in development first
 * - Backup database before running in production
 * - Keep migrations small and focused
 * - Never modify migrations after they're deployed
 * - Use transactions for complex migrations
 * - Document any data transformations
 */
