import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterOrganizationUsersAddColumn1643098978688
  implements MigrationInterface
{
  name = 'alterOrganizationUsersAddColumn1643098978688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD "role" smallint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "organization_users"."role" IS '1: administrator, 2: read only'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "organization_users"."role" IS '1: administrator, 2: read only'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP COLUMN "role"`,
    );
  }
}
