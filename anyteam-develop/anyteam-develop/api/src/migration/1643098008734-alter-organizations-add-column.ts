import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterOrganizationsAddColumn1643098008734
  implements MigrationInterface
{
  name = 'alterOrganizationsAddColumn1643098008734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "postal_code" character varying(8)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "postal_code"`,
    );
  }
}
