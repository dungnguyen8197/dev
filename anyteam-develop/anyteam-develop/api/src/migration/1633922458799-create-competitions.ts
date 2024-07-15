import {MigrationInterface, QueryRunner} from "typeorm";

export class createCompetitions1633922458799 implements MigrationInterface {
    name = 'createCompetitions1633922458799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "competitions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_ef273910798c3a542b475e75c7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "public"."teams"."competition_id" IS 'competitions.id'`);
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD CONSTRAINT "FK_01799926ca2a97ad5b30b16fe56" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "competitions"`);
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP CONSTRAINT "FK_01799926ca2a97ad5b30b16fe56"`);
    }
}
