import {MigrationInterface, QueryRunner} from "typeorm";

export class alterUserProfilesAddColumns1631450031765 implements MigrationInterface {
    name = 'alterUserProfilesAddColumns1631450031765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "thumbnail" text`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "birthday" date`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "job" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "university_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "university_graduation_year" integer`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "university_club" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "high_school_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "high_school_graduation_year" integer`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "high_school_club" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "high_school_club"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "high_school_graduation_year"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "high_school_name"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "university_club"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "university_graduation_year"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "university_name"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "job"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "thumbnail"`);
    }

}
