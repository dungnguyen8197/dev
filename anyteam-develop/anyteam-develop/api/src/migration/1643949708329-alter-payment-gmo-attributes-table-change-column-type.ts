import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterPaymentGmoAttributesTableChangeColumnType1643949708329
  implements MigrationInterface
{
  name = 'alterPaymentGmoAttributesTableChangeColumnType1643949708329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" DROP COLUMN "tran_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ADD "tran_id" character varying(28) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_gmo_attributes"."tran_id" IS 'Transaction ID from GMO via ExecTran API'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" DROP COLUMN "tran_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ADD "tran_date" character varying(14) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_gmo_attributes"."tran_date" IS 'Transaction date from GMO via ExecTran API'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_gmo_attributes"."tran_date" IS 'Transaction date from GMO via ExecTran API'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" DROP COLUMN "tran_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ADD "tran_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_gmo_attributes"."tran_id" IS 'Transaction ID from GMO via ExecTran API'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" DROP COLUMN "tran_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ADD "tran_id" character varying(7) NOT NULL`,
    );
  }
}
