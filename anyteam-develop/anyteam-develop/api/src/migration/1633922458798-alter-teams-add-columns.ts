import {MigrationInterface, QueryRunner} from "typeorm";

export class alterTeamsAddColumns1633922458798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "organization_id" integer`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "competition_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "competition_id "`);
    }

}
