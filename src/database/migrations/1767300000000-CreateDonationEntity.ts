import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDonationEntity1767300000000 implements MigrationInterface {
  name = 'CreateDonationEntity1767300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "donations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" numeric(10,2) NOT NULL,
        "message" text,
        "status" character varying NOT NULL DEFAULT 'Pending',
        "razorpay_order_id" character varying(255),
        "razorpay_payment_id" character varying(255),
        "razorpay_signature" character varying(255),
        "anonymous_donor_name" character varying(255),
        "anonymous_donor_email" character varying(255),
        "anonymous_donor_phone" character varying(20),
        "pool_id" uuid NOT NULL,
        "user_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_donations_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_donations_pool_id" ON "donations" ("pool_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_donations_user_id" ON "donations" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_donations_status" ON "donations" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_donations_razorpay_order_id" ON "donations" ("razorpay_order_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "donations" 
      ADD CONSTRAINT "FK_donations_pool_id" 
      FOREIGN KEY ("pool_id") 
      REFERENCES "pools"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "donations" 
      ADD CONSTRAINT "FK_donations_user_id" 
      FOREIGN KEY ("user_id") 
      REFERENCES "users"("id") 
      ON DELETE SET NULL 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donations" DROP CONSTRAINT "FK_donations_user_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "donations" DROP CONSTRAINT "FK_donations_pool_id"
    `);

    await queryRunner.query(`DROP INDEX "IDX_donations_razorpay_order_id"`);
    await queryRunner.query(`DROP INDEX "IDX_donations_status"`);
    await queryRunner.query(`DROP INDEX "IDX_donations_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_donations_pool_id"`);

    await queryRunner.query(`DROP TABLE "donations"`);
  }
}
