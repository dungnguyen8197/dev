import { MigrationInterface, QueryRunner } from 'typeorm';

export class createOrganizationRelations1647830063748
  implements MigrationInterface
{
  name = 'createOrganizationRelations1647830063748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization_relations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" integer NOT NULL, "available_organization_id" integer NOT NULL, CONSTRAINT "PK_6197526c40b63d98baf5c5f8569" PRIMARY KEY ("id")); COMMENT ON COLUMN "organization_relations"."organization_id" IS 'organizations.id'; COMMENT ON COLUMN "organization_relations"."available_organization_id" IS 'organizations.id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_relations" ADD CONSTRAINT "FK_69607e70ed6ef7264f85148a81f" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_relations" ADD CONSTRAINT "FK_50762fd5f7c4addd0e4720f1f86" FOREIGN KEY ("available_organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_relations" DROP CONSTRAINT "FK_50762fd5f7c4addd0e4720f1f86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_relations" DROP CONSTRAINT "FK_69607e70ed6ef7264f85148a81f"`,
    );
    await queryRunner.query(`DROP TABLE "organization_relations"`);
  }
}
