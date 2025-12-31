import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileEntity1767186254182 implements MigrationInterface {
    name = 'CreateFileEntity1767186254182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying(500) NOT NULL, "fileType" character varying(100) NOT NULL, "fileSize" bigint NOT NULL, "uploadDate" TIMESTAMP NOT NULL DEFAULT now(), "uploaderId" uuid NOT NULL, "filePath" character varying(1000) NOT NULL, "moduleName" character varying(100) NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_bcc22fe79462563aa584d143f27" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_bcc22fe79462563aa584d143f27"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
