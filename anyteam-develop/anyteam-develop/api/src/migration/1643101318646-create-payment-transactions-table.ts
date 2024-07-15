import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPaymentTransactionsTable1643101318646
  implements MigrationInterface
{
  name = 'createPaymentTransactionsTable1643101318646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_transactions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "UQ_77fab0556decc83a81a5bf8c25d" UNIQUE ("user_id"), CONSTRAINT "REL_77fab0556decc83a81a5bf8c25" UNIQUE ("user_id"), CONSTRAINT "PK_d32b3c6b0d2c1d22604cbcc8c49" PRIMARY KEY ("id")); COMMENT ON COLUMN "payment_transactions"."user_id" IS 'user.id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ADD CONSTRAINT "FK_77fab0556decc83a81a5bf8c25d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" DROP CONSTRAINT "FK_77fab0556decc83a81a5bf8c25d"`,
    );
    await queryRunner.query(`DROP TABLE "payment_transactions"`);
  }
}
