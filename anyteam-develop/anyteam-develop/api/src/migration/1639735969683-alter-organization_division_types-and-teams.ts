import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterOrganizationDivisionTypesAndTeams1639735969683
  implements MigrationInterface
{
  name = 'alterOrganizationDivisionTypesAndTeams1639735969683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_division_types" DROP CONSTRAINT "FK_83d394fc1db9b0931de80f19517"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_division_types" ALTER COLUMN "organization_type_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "organization_division_types"."organization_type_id" IS ' organization_types.id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_fdc736f761896ccc179c823a785"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_01799926ca2a97ad5b30b16fe56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "organization_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "competition_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "organization_users"."organization_id" IS 'organizations.id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_division_types" ADD CONSTRAINT "FK_83d394fc1db9b0931de80f19517" FOREIGN KEY ("organization_type_id") REFERENCES "organization_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_01799926ca2a97ad5b30b16fe56" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_fdc736f761896ccc179c823a785" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_fdc736f761896ccc179c823a785"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_01799926ca2a97ad5b30b16fe56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_division_types" DROP CONSTRAINT "FK_83d394fc1db9b0931de80f19517"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "organization_users"."organization_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "competition_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "organization_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_01799926ca2a97ad5b30b16fe56" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_fdc736f761896ccc179c823a785" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "organization_division_types"."organization_type_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_division_types" ALTER COLUMN "organization_type_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_division_types" ADD CONSTRAINT "FK_83d394fc1db9b0931de80f19517" FOREIGN KEY ("organization_type_id") REFERENCES "organization_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
