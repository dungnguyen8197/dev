import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserEmailUpdateTransactions1638947037474
  implements MigrationInterface
{
  name = 'createUserEmailUpdateTransactions1638947037474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_email_update_transactions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" bigint NOT NULL, "email" character varying(255) NOT NULL, "code" character varying(4) NOT NULL, CONSTRAINT "PK_7a515215f0a9ef6d34b44f7784b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_email_update_transactions"`);
  }
}
