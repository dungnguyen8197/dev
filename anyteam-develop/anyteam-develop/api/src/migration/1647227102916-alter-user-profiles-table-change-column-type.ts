import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserProfilesTableChangeColumnType1647227102916
  implements MigrationInterface
{
  name = 'alterUserProfilesTableChangeColumnType1647227102916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "firstname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "lastname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "firstname_kana" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "lastname_kana" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "firstname" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "lastname" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "firstname_kana" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ALTER COLUMN "lastname_kana" SET NOT NULL`,
    );
  }
}
