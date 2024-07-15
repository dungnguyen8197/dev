import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterPaymentGmoAttributesTableChangeColumnType1644386000433
  implements MigrationInterface
{
  name = 'alterPaymentGmoAttributesTableChangeColumnType1644386000433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "access_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "access_pass" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "approve" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "tran_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "tran_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "forward" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "error_info" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "error_info" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "forward" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "tran_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "tran_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "approve" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "access_pass" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ALTER COLUMN "access_id" SET NOT NULL`,
    );
  }
}
