import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePoolEntity1767211061533 implements MigrationInterface {
    name = 'CreatePoolEntity1767211061533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pools" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "sampleSource" character varying(255) NOT NULL, "batchNumber" character varying(100) NOT NULL, "description" text, "poolPrice" numeric(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isApproved" boolean NOT NULL DEFAULT false, "category_id" uuid NOT NULL, "sample_image_id" uuid, "user_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_6708c86fc389259de3ee43230ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."files_modulename_enum" RENAME TO "files_modulename_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."files_modulename_enum" AS ENUM('user', 'role', 'permission', 'file', 'sample-product', 'pool', 'general')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "moduleName" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "moduleName" TYPE "public"."files_modulename_enum" USING "moduleName"::"text"::"public"."files_modulename_enum"`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "moduleName" SET DEFAULT 'general'`);
        await queryRunner.query(`DROP TYPE "public"."files_modulename_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_5b03d90495e43dde307097da3b3" FOREIGN KEY ("category_id") REFERENCES "sample_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_1a0feaf1d45921094828d04fea5" FOREIGN KEY ("sample_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_a08aa99bd78a06de6efc459369f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_a08aa99bd78a06de6efc459369f"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_1a0feaf1d45921094828d04fea5"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_5b03d90495e43dde307097da3b3"`);
        await queryRunner.query(`CREATE TYPE "public"."files_modulename_enum_old" AS ENUM('user', 'role', 'permission', 'file', 'sample-product', 'general')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "moduleName" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "moduleName" TYPE "public"."files_modulename_enum_old" USING "moduleName"::"text"::"public"."files_modulename_enum_old"`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "moduleName" SET DEFAULT 'general'`);
        await queryRunner.query(`DROP TYPE "public"."files_modulename_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."files_modulename_enum_old" RENAME TO "files_modulename_enum"`);
        await queryRunner.query(`DROP TABLE "pools"`);
    }

}
