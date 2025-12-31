import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteColumns1767208962275 implements MigrationInterface {
    name = 'AddSoftDeleteColumns1767208962275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if columns already exist before adding them
        const tables = ['permissions', 'roles', 'users', 'sample_products', 'files'];
        
        for (const table of tables) {
            const columnExists = await queryRunner.hasColumn(table, 'deletedAt');
            if (!columnExists) {
                await queryRunner.query(`ALTER TABLE "${table}" ADD "deletedAt" TIMESTAMP`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "sample_products" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "deletedAt"`);
    }

}
