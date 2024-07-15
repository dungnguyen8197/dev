import {MigrationInterface, QueryRunner} from "typeorm";

export class createOrganizations1633940722658 implements MigrationInterface {
    name = 'createOrganizations1633940722658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "name_line_id" integer NOT NULL, "region_id" integer NOT NULL, "division_type_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id")); COMMENT ON COLUMN "organizations"."region_id" IS 'regions.id'; COMMENT ON COLUMN "organizations"."division_type_id" IS 'organization_division_types.id'`);
        await queryRunner.query(`COMMENT ON COLUMN "public"."teams"."organization_id" IS ' organizations.id'`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_a79e62a8a8b4406db348559eee8" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_d0636f1a40f32301e04ec4e3d8b" FOREIGN KEY ("division_type_id") REFERENCES "organization_division_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD CONSTRAINT "FK_fdc736f761896ccc179c823a785" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_a79e62a8a8b4406db348559eee8"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_d0636f1a40f32301e04ec4e3d8b"`);
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP CONSTRAINT "FK_fdc736f761896ccc179c823a785"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
    }

}
