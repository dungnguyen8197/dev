import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterPurchasesAddColumnIsActive1647274504240
  implements MigrationInterface
{
  name = 'alterPurchasesAddColumnIsActive1647274504240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "is_active"`);
  }
}
