import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUsersAddColumnIsActive1647275699436
  implements MigrationInterface
{
  name = 'alterUsersAddColumnIsActive1647275699436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
  }
}
