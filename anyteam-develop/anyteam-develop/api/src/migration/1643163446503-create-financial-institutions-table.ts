import { MigrationInterface, QueryRunner } from 'typeorm';

export class createFinancialInstitutionsTable1643163446503
  implements MigrationInterface
{
  name = 'createFinancialInstitutionsTable1643163446503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "financial_institutions" ("id" SERIAL NOT NULL, "code" character varying(4) NOT NULL, "shop_code" character varying(3) NOT NULL, "name" character varying(255) NOT NULL, "name_kana" character varying(255) NOT NULL, "shop_name" character varying(255) NOT NULL, "shop_name_kana" character varying(255) NOT NULL, "postal_code" character varying(8) NOT NULL, "location" text NOT NULL, "telephone_number" character varying(17) NOT NULL, "bill_exchange_number" character varying(4) NOT NULL, "sort_code" smallint NOT NULL, CONSTRAINT "PK_6e151221fe3d93793c300d0c615" PRIMARY KEY ("id")); COMMENT ON COLUMN "financial_institutions"."code" IS 'Financial institution code'; COMMENT ON COLUMN "financial_institutions"."shop_code" IS 'Financial institution shop code'; COMMENT ON COLUMN "financial_institutions"."name" IS 'Financial institution name'; COMMENT ON COLUMN "financial_institutions"."name_kana" IS 'Financial institution name kana'; COMMENT ON COLUMN "financial_institutions"."shop_name" IS 'Financial institution shop name'; COMMENT ON COLUMN "financial_institutions"."shop_name_kana" IS 'Financial institution shop name kana'; COMMENT ON COLUMN "financial_institutions"."sort_code" IS '0 or 1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "financial_institutions"`);
  }
}
