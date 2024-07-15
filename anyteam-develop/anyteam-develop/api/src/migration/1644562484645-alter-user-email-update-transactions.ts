import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserEmailUpdateTransactions1644562484645
  implements MigrationInterface
{
  name = 'alterUserEmailUpdateTransactions1644562484645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_email_update_transactions" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_email_update_transactions" ADD "code" character varying(6) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_email_update_transactions" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_email_update_transactions" ADD "code" character varying(4) NOT NULL`,
    );
  }
}
