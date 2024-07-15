import {MigrationInterface, QueryRunner} from "typeorm";

export class createOrganizationTypes1633681941910 implements MigrationInterface {
    name = 'createOrganizationTypes1633681941910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_types" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_1e086602db2811aa43bfd5ff149" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "organization_types"`);
    }
}
