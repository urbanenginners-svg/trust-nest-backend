import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePoolEntity1767211144678 implements MigrationInterface {
  name = 'CreatePoolEntity1767211144678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create pools table
    await queryRunner.query(`
            CREATE TABLE "pools" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "sampleSource" character varying(255) NOT NULL,
                "batchNumber" character varying(100) NOT NULL,
                "description" text,
                "poolPrice" numeric(10,2) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "isApproved" boolean NOT NULL DEFAULT false,
                "category_id" uuid NOT NULL,
                "sample_image_id" uuid,
                "user_id" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_pools" PRIMARY KEY ("id")
            )
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "pools" ADD CONSTRAINT "FK_pools_category" 
            FOREIGN KEY ("category_id") REFERENCES "sample_products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "pools" ADD CONSTRAINT "FK_pools_sample_image" 
            FOREIGN KEY ("sample_image_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "pools" ADD CONSTRAINT "FK_pools_user" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

    // Update files_modulename_enum to include 'pool'
    await queryRunner.query(`
            ALTER TYPE "files_modulename_enum" ADD VALUE 'pool'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "pools" DROP CONSTRAINT "FK_pools_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pools" DROP CONSTRAINT "FK_pools_sample_image"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pools" DROP CONSTRAINT "FK_pools_category"`,
    );

    // Drop pools table
    await queryRunner.query(`DROP TABLE "pools"`);

    // Note: Cannot easily remove enum value from PostgreSQL enum type in a rollback
    // This would require recreating the enum type and updating all dependent columns
  }
}
