import {MigrationInterface, QueryRunner} from "typeorm";

export class alterOriganizationUsersTable1635735747309 implements MigrationInterface {
    name = 'alterOriganizationUsersTable1635735747309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."organization_users" ADD "is_temporary" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {   
        await queryRunner.query(`ALTER TABLE "public"."organization_users" DROP COLUMN "is_temporary"`);
    }

}
