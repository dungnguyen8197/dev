import {MigrationInterface, QueryRunner} from "typeorm";

export class createOrganizationDivisionTypes1633687330174 implements MigrationInterface {
    name = 'createOrganizationDivisionTypes1633687330174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_division_types" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "organization_type_id" integer, CONSTRAINT "PK_09b9f037b88896832c5e762760a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organization_division_types" ADD CONSTRAINT "FK_83d394fc1db9b0931de80f19517" FOREIGN KEY ("organization_type_id") REFERENCES "organization_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_division_types" DROP CONSTRAINT "FK_83d394fc1db9b0931de80f19517"`);
        await queryRunner.query(`DROP TABLE "organization_division_types"`);
    }
}
