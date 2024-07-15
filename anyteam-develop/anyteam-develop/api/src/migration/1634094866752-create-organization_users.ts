import {MigrationInterface, QueryRunner} from "typeorm";

export class createOrganizationUsers1634094866752 implements MigrationInterface {
    name = 'createOrganizationUsers1634094866752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_users" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(100) NOT NULL, "organization_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af79a22d50256af35812ba60a87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6"`);
        await queryRunner.query(`DROP TABLE "organization_users"`);
    }

}
