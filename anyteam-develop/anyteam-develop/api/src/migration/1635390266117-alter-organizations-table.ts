import {MigrationInterface, QueryRunner} from "typeorm";

export class alterOrganizationsTable1635390266117 implements MigrationInterface {
    name = 'alterOrganizationsTable1635390266117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "email" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "municipalities" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "building_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "telephone_number" character varying(13)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "bank_code" character varying(4)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "branch_code" character varying(3)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "account_type_id" integer`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "account_number" character varying(8)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "account_holder" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "icon" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" ADD "is_group" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "is_group"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "account_holder"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "account_number"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "account_type_id"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "branch_code"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "bank_code"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "telephone_number"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "building_name"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "municipalities"`);
        await queryRunner.query(`ALTER TABLE "public"."organizations" DROP COLUMN "email"`);
    }

}
