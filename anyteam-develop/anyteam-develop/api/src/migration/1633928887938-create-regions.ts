import {MigrationInterface, QueryRunner} from "typeorm";

export class createRegions1633928887938 implements MigrationInterface {
    name = 'createRegions1633928887938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "regions" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "region_group_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id")); COMMENT ON COLUMN "regions"."region_group_id" IS 'region_group.id'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "regions"`);
    }

}
