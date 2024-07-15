import { MigrationInterface, QueryRunner } from 'typeorm';

export class createBulkPaymentTransactions1648205776255
  implements MigrationInterface
{
  name = 'createBulkPaymentTransactions1648205776255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bulk_payment_transactions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "year_month" character varying(6) NOT NULL, "stage" smallint NOT NULL DEFAULT '1', "filename" text, CONSTRAINT "PK_6f312b391342b9abc7f8bfb5b69" PRIMARY KEY ("id")); COMMENT ON COLUMN "bulk_payment_transactions"."year_month" IS 'YYYYMM'; COMMENT ON COLUMN "bulk_payment_transactions"."stage" IS '1: uploading, 2: uploaded, 3: downloading, 4: complete'; COMMENT ON COLUMN "bulk_payment_transactions"."filename" IS '"batm" + {ShopID} + {YYYYMMDD} + {serial number}'`,
    );
    await queryRunner.query(
      `CREATE INDEX "year-month-idx" ON "bulk_payment_transactions" ("year_month") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."year-month-idx"`);
    await queryRunner.query(`DROP TABLE "bulk_payment_transactions"`);
  }
}
