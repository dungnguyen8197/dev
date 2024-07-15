import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterPaymentOrganizationSummariesAddColumns1646986130131
  implements MigrationInterface
{
  name = 'alterPaymentOrganizationSummariesAddColumns1646986130131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" ADD "general_support_count" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."general_support_count" IS 'general support count to organization'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" ADD "general_support_amount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."general_support_amount" IS 'general support amount to organization'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" ADD "subscription_support_count" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."subscription_support_count" IS 'subscription support count to organization'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" ADD "subscription_support_amount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."subscription_support_amount" IS 'subscription support amount to organization'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."subscription_support_amount" IS 'subscription support amount to organization'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" DROP COLUMN "subscription_support_amount"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."subscription_support_count" IS 'subscription support count to organization'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" DROP COLUMN "subscription_support_count"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."general_support_amount" IS 'general support amount to organization'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" DROP COLUMN "general_support_amount"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_organization_summaries"."general_support_count" IS 'general support count to organization'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_organization_summaries" DROP COLUMN "general_support_count"`,
    );
  }
}
