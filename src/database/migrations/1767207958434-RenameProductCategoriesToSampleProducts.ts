import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameProductCategoriesToSampleProducts1767207958434 implements MigrationInterface {
  name = 'RenameProductCategoriesToSampleProducts1767207958434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the new sample_products table
    await queryRunner.query(
      `CREATE TABLE "sample_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "code" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5cee7537bff9247735757842bea" UNIQUE ("name"), CONSTRAINT "PK_5d0503d9ac4b9a7557ad50aed07" PRIMARY KEY ("id"))`,
    );

    // Migrate data from product_categories to sample_products if the old table exists
    const productCategoriesExists =
      await queryRunner.hasTable('product_categories');
    if (productCategoriesExists) {
      await queryRunner.query(
        `INSERT INTO "sample_products" ("id", "name", "description", "code", "isActive", "createdAt", "updatedAt") SELECT "id", "name", "description", "code", "isActive", "createdAt", "updatedAt" FROM "product_categories"`,
      );
      await queryRunner.query(`DROP TABLE "product_categories"`);
    }

    // Update the enum type for file module names
    await queryRunner.query(
      `ALTER TYPE "public"."files_modulename_enum" RENAME TO "files_modulename_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."files_modulename_enum" AS ENUM('user', 'role', 'permission', 'file', 'sample-product', 'general')`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "moduleName" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "moduleName" TYPE "public"."files_modulename_enum" USING "moduleName"::"text"::"public"."files_modulename_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "moduleName" SET DEFAULT 'general'`,
    );
    await queryRunner.query(`DROP TYPE "public"."files_modulename_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."files_modulename_enum_old" AS ENUM('user', 'role', 'permission', 'file', 'general')`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "moduleName" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "moduleName" TYPE "public"."files_modulename_enum_old" USING "moduleName"::"text"::"public"."files_modulename_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "moduleName" SET DEFAULT 'general'`,
    );
    await queryRunner.query(`DROP TYPE "public"."files_modulename_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."files_modulename_enum_old" RENAME TO "files_modulename_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sample_products"`);
  }
}
