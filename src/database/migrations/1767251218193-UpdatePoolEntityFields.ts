import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePoolEntityFields1767251218193 implements MigrationInterface {
    name = 'UpdatePoolEntityFields1767251218193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_pools_category"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_pools_sample_image"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_pools_user"`);
        await queryRunner.query(`CREATE TYPE "public"."pools_status_enum" AS ENUM('Created', 'Funding', 'Target Reached', 'Sent to Lab', 'Results Ready')`);
        await queryRunner.query(`ALTER TABLE "pools" ADD "status" "public"."pools_status_enum" NOT NULL DEFAULT 'Created'`);
        await queryRunner.query(`ALTER TABLE "pools" ADD "totalContributors" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "pools" ADD "amountReceived" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "pools" ALTER COLUMN "poolPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_5b03d90495e43dde307097da3b3" FOREIGN KEY ("category_id") REFERENCES "sample_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_1a0feaf1d45921094828d04fea5" FOREIGN KEY ("sample_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_a08aa99bd78a06de6efc459369f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_a08aa99bd78a06de6efc459369f"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_1a0feaf1d45921094828d04fea5"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "FK_5b03d90495e43dde307097da3b3"`);
        await queryRunner.query(`ALTER TABLE "pools" ALTER COLUMN "poolPrice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pools" DROP COLUMN "amountReceived"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP COLUMN "totalContributors"`);
        await queryRunner.query(`ALTER TABLE "pools" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."pools_status_enum"`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_pools_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_pools_sample_image" FOREIGN KEY ("sample_image_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "FK_pools_category" FOREIGN KEY ("category_id") REFERENCES "sample_products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
