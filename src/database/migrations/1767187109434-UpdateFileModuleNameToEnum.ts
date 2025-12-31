import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFileModuleNameToEnum1767187109434 implements MigrationInterface {
    name = 'UpdateFileModuleNameToEnum1767187109434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "moduleName"`);
        await queryRunner.query(`CREATE TYPE "public"."files_modulename_enum" AS ENUM('user', 'role', 'permission', 'file', 'general')`);
        await queryRunner.query(`ALTER TABLE "files" ADD "moduleName" "public"."files_modulename_enum" NOT NULL DEFAULT 'general'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "moduleName"`);
        await queryRunner.query(`DROP TYPE "public"."files_modulename_enum"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "moduleName" character varying(100) NOT NULL`);
    }

}
