import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterOrganizationsTableAddColumnNameKana1643950341224
  implements MigrationInterface
{
  name = 'alterOrganizationsTableAddColumnNameKana1643950341224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "name_kana" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "name_kana"`,
    );
  }
}
