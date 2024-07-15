import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterOrganizationWalletsAddColumn1643099406687
  implements MigrationInterface
{
  name = 'alterOrganizationWalletsAddColumn1643099406687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "enabled" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "enabled"`);
  }
}
