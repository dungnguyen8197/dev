import {MigrationInterface, QueryRunner} from "typeorm";

export class createAdministrators1633071939313 implements MigrationInterface {

    name = 'createAdministrators1633071939313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "administrators" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(100) NOT NULL, CONSTRAINT "UQ_administrators" UNIQUE ("email"), CONSTRAINT "PK_administrators" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "administrators"`);
    }

}
