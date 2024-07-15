import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterWalletsTable1640229363304 implements MigrationInterface {
  name = 'alterWalletsTable1640229363304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "expiration_year" character varying(4)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "wallets"."expiration_year" IS 'expiration year of card'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "expiration_month" character varying(2)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "wallets"."expiration_month" IS 'expiration month of card'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "wallets"."expiration_month" IS 'expiration month of card'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP COLUMN "expiration_month"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "wallets"."expiration_year" IS 'expiration year of card'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP COLUMN "expiration_year"`,
    );
  }
}
