import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserProfile1638345663630 implements MigrationInterface {
  name = 'alterUserProfile1638345663630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "job"`);
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP COLUMN "high_school_graduation_year"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP COLUMN "university_graduation_year"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "firstname_kana" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "lastname_kana" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "is_anonymous" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "gender_type_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "postal_code" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "region_id" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "public"."user_profiles"."region_id" IS 'regions.id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "municipalities" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "address" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "building_name" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "junior_high_school_name" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "junior_high_school_club" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "favorite_competition1" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "favorite_competition2" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "favorite_competition3" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "favorite_team1" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "favorite_team2" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" ADD "favorite_team3" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD "job" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD "university_graduation_year" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD "high_school_graduation_year" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "favorite_team3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "favorite_team2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "favorite_team1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "favorite_competition3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "favorite_competition2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "favorite_competition1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "junior_high_school_club"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "junior_high_school_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "building_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "municipalities"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "public"."user_profiles"."region_id" IS 'regions.id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "region_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "postal_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "gender_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "is_anonymous"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "lastname_kana"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_profiles" DROP COLUMN "firstname_kana"`,
    );
  }
}
