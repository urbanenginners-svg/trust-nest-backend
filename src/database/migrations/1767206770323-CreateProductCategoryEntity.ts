import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductCategoryEntity1767206770323 implements MigrationInterface {
  name = 'CreateProductCategoryEntity1767206770323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "code" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a75bfadcd8291a0538ab7abfdcf" UNIQUE ("name"), CONSTRAINT "PK_7069dac60d88408eca56fdc9e0c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product_categories"`);
  }
}
