import {MigrationInterface, QueryRunner} from "typeorm";

export class alterTeamsTable1636945949361 implements MigrationInterface {
    name = 'alterTeamsTable1636945949361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD "enabled" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP COLUMN "enabled"`);
    }

}
