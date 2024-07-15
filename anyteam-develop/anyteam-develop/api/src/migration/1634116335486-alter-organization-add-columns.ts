import {MigrationInterface, QueryRunner} from "typeorm";

export class alterOrganizationAddColumns1634116335486 implements MigrationInterface {
    name = 'alterOrganizationAddColumns1634116335486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "status" smallint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "status"`);
    }

}
