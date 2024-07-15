import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPaymentSupports1646123613977 implements MigrationInterface {
  name = 'createPaymentSupports1646123613977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_competition_summaries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "competition_id" integer NOT NULL, "amount" integer NOT NULL, "year" smallint NOT NULL, "month" smallint NOT NULL, CONSTRAINT "PK_877d5d06d0e6c5d01a3a19544f0" PRIMARY KEY ("id")); COMMENT ON COLUMN "payment_competition_summaries"."competition_id" IS 'competition.id'; COMMENT ON COLUMN "payment_competition_summaries"."amount" IS 'total amount to competition'; COMMENT ON COLUMN "payment_competition_summaries"."year" IS 'calculation year'; COMMENT ON COLUMN "payment_competition_summaries"."month" IS 'calculation month'`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_organization_summaries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" integer NOT NULL, "amount" integer NOT NULL, "year" smallint NOT NULL, "month" smallint NOT NULL, CONSTRAINT "PK_9fa18b2f461be5709dea4b90fec" PRIMARY KEY ("id")); COMMENT ON COLUMN "payment_organization_summaries"."organization_id" IS 'organization.id'; COMMENT ON COLUMN "payment_organization_summaries"."amount" IS 'total amount to organization'; COMMENT ON COLUMN "payment_organization_summaries"."year" IS 'calculation year'; COMMENT ON COLUMN "payment_organization_summaries"."month" IS 'calculation month'`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_support_organization_summaries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "organization_id" integer NOT NULL, "amount" integer NOT NULL, "year" smallint NOT NULL, "month" smallint NOT NULL, CONSTRAINT "PK_7aa39ef6c4a674b5055882a6237" PRIMARY KEY ("id")); COMMENT ON COLUMN "payment_support_organization_summaries"."user_id" IS 'user.id'; COMMENT ON COLUMN "payment_support_organization_summaries"."organization_id" IS 'organization.id'; COMMENT ON COLUMN "payment_support_organization_summaries"."amount" IS 'total amount to organization per user'; COMMENT ON COLUMN "payment_support_organization_summaries"."year" IS 'calculation year'; COMMENT ON COLUMN "payment_support_organization_summaries"."month" IS 'calculation month'`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_support_team_summaries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "team_id" integer NOT NULL, "amount" integer NOT NULL, "year" smallint NOT NULL, "month" smallint NOT NULL, CONSTRAINT "PK_224d603fc09c6b703d2027a90a9" PRIMARY KEY ("id")); COMMENT ON COLUMN "payment_support_team_summaries"."user_id" IS 'user.id'; COMMENT ON COLUMN "payment_support_team_summaries"."team_id" IS 'team.id'; COMMENT ON COLUMN "payment_support_team_summaries"."amount" IS 'total amount to team per user'; COMMENT ON COLUMN "payment_support_team_summaries"."year" IS 'calculation year'; COMMENT ON COLUMN "payment_support_team_summaries"."month" IS 'calculation month'`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_team_summaries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "team_id" integer NOT NULL, "amount" integer NOT NULL, "general_support_count" integer NOT NULL DEFAULT '0', "general_support_amount" integer NOT NULL DEFAULT '0', "subscription_support_count" integer NOT NULL DEFAULT '0', "subscription_support_amount" integer NOT NULL DEFAULT '0', "year" smallint NOT NULL, "month" smallint NOT NULL, CONSTRAINT "PK_20d42036bf8047808b6d3851e12" PRIMARY KEY ("id")); COMMENT ON COLUMN "payment_team_summaries"."team_id" IS 'team.id'; COMMENT ON COLUMN "payment_team_summaries"."amount" IS 'total amount to team'; COMMENT ON COLUMN "payment_team_summaries"."general_support_count" IS 'general support count to team'; COMMENT ON COLUMN "payment_team_summaries"."general_support_amount" IS 'general support amount to team'; COMMENT ON COLUMN "payment_team_summaries"."subscription_support_count" IS 'subscription support count to team'; COMMENT ON COLUMN "payment_team_summaries"."subscription_support_amount" IS 'subscription support amount to team'; COMMENT ON COLUMN "payment_team_summaries"."year" IS 'calculation year'; COMMENT ON COLUMN "payment_team_summaries"."month" IS 'calculation month'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_competition_summaries" ADD CONSTRAINT "FK_061368e3a48167157bdcc169235" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" ADD CONSTRAINT "FK_4c7d3d8023b467cd6a2bcd57888" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_organization_summaries" ADD CONSTRAINT "FK_afce79da40da7895499021e5826" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_organization_summaries" ADD CONSTRAINT "FK_55b7ed8dfd78c542f4791b26643" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_team_summaries" ADD CONSTRAINT "FK_8ec7e7f92cd0c10dbf5f95620f8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_team_summaries" ADD CONSTRAINT "FK_93df1079d0a7d47d36f33c7ae86" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_team_summaries" ADD CONSTRAINT "FK_4fcd708072c5044fca0b0972e06" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_team_summaries" DROP CONSTRAINT "FK_4fcd708072c5044fca0b0972e06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_team_summaries" DROP CONSTRAINT "FK_93df1079d0a7d47d36f33c7ae86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_team_summaries" DROP CONSTRAINT "FK_8ec7e7f92cd0c10dbf5f95620f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_organization_summaries" DROP CONSTRAINT "FK_55b7ed8dfd78c542f4791b26643"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_support_organization_summaries" DROP CONSTRAINT "FK_afce79da40da7895499021e5826"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" DROP CONSTRAINT "FK_4c7d3d8023b467cd6a2bcd57888"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_competition_summaries" DROP CONSTRAINT "FK_061368e3a48167157bdcc169235"`,
    );
    await queryRunner.query(`DROP TABLE "payment_team_summaries"`);
    await queryRunner.query(`DROP TABLE "payment_support_team_summaries"`);
    await queryRunner.query(
      `DROP TABLE "payment_support_organization_summaries"`,
    );
    await queryRunner.query(`DROP TABLE "payment_organization_summaries"`);
    await queryRunner.query(`DROP TABLE "payment_competition_summaries"`);
  }
}
