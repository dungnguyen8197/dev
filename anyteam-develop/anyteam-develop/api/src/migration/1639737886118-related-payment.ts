import { MigrationInterface, QueryRunner } from 'typeorm';

export class relatedPayment1639737886118 implements MigrationInterface {
  name = 'relatedPayment1639737886118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchase_team_attributes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "purchase_id" integer NOT NULL, "team_id" integer NOT NULL, CONSTRAINT "REL_711d4d3d69a72a58d884bfd88b" UNIQUE ("purchase_id"), CONSTRAINT "PK_a908cec162e31da830a991787f9" PRIMARY KEY ("id")); COMMENT ON COLUMN "purchase_team_attributes"."purchase_id" IS 'purchase.id'; COMMENT ON COLUMN "purchase_team_attributes"."team_id" IS 'team.id'`,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "purchase_id" integer NOT NULL, "filename" text, CONSTRAINT "REL_7228b72ce7ee1765fce65d5a2a" UNIQUE ("purchase_id"), CONSTRAINT "PK_3d947441a48debeb9b7366f8b8c" PRIMARY KEY ("id")); COMMENT ON COLUMN "rewards"."purchase_id" IS 'purchase.id'`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "status" smallint NOT NULL DEFAULT '1', "type" smallint NOT NULL, "amount" integer NOT NULL, "purchased_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id")); COMMENT ON COLUMN "purchases"."user_id" IS 'user.id'; COMMENT ON COLUMN "purchases"."status" IS '0: invalid, 1: valid'; COMMENT ON COLUMN "purchases"."type" IS '1: pay as you go, 2: subscription'`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_gmo_attributes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "payment_id" integer NOT NULL, "order_id" character varying(27) NOT NULL, "job_cd" character varying(7) NOT NULL, "is_success" boolean NOT NULL, "method" smallint NOT NULL DEFAULT '0', "access_id" character varying(32) NOT NULL, "access_pass" character varying(32) NOT NULL, "approve" character varying(7) NOT NULL, "tran_id" character varying(7) NOT NULL, "tran_date" TIMESTAMP NOT NULL, "forward" character varying(7) NOT NULL, "error_info" json NOT NULL, CONSTRAINT "UQ_7c7e724ce7cb41285baf1acad91" UNIQUE ("order_id"), CONSTRAINT "REL_c0424bc148c15c1ee716bd9950" UNIQUE ("payment_id"), CONSTRAINT "PK_d9b316cd08efd893c970da349e7" PRIMARY KEY ("id")); COMMENT ON COLUMN "payment_gmo_attributes"."payment_id" IS 'payment.id'; COMMENT ON COLUMN "payment_gmo_attributes"."order_id" IS '\`at-\` + timestamp which contained micro seconds'; COMMENT ON COLUMN "payment_gmo_attributes"."job_cd" IS 'CHECK or CAPTURE'; COMMENT ON COLUMN "payment_gmo_attributes"."method" IS 'Fixed value'; COMMENT ON COLUMN "payment_gmo_attributes"."access_id" IS 'Access ID from GMO via EntryTran API'; COMMENT ON COLUMN "payment_gmo_attributes"."access_pass" IS 'Access Pass from GMO via EntryTran API'; COMMENT ON COLUMN "payment_gmo_attributes"."approve" IS 'Access code from GMO via ExecTran API'; COMMENT ON COLUMN "payment_gmo_attributes"."tran_id" IS 'Transaction ID from GMO via ExecTran API'; COMMENT ON COLUMN "payment_gmo_attributes"."tran_date" IS 'Transaction date from GMO via ExecTran API'; COMMENT ON COLUMN "payment_gmo_attributes"."forward" IS 'Destination card company from GMO via SaveCard API'; COMMENT ON COLUMN "payment_gmo_attributes"."error_info" IS 'Error info in GMO transaction'`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "wallet_id" integer NOT NULL, "purchase_id" integer, "amount" integer NOT NULL, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")); COMMENT ON COLUMN "payments"."wallet_id" IS 'wallet.id'; COMMENT ON COLUMN "payments"."purchase_id" IS 'purchase.id'`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "payment_method" smallint NOT NULL, "card_no" character varying(16), CONSTRAINT "REL_92558c08091598f7a4439586cd" UNIQUE ("user_id"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id")); COMMENT ON COLUMN "wallets"."user_id" IS 'user.id'; COMMENT ON COLUMN "wallets"."payment_method" IS '1: card payment'; COMMENT ON COLUMN "wallets"."card_no" IS 'masked credit card number'`,
    );
    await queryRunner.query(
      `CREATE TABLE "corporate_profiles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "name" character varying(50) NOT NULL, "name_kana" character varying(50) NOT NULL, "representative_position" character varying(50), "representative_firstname" character varying(50), "representative_lastname" character varying(50), "representative_firstname_kana" character varying(50), "representative_lastname_kana" character varying(50), "staff_department" character varying(50), "staff_firstname" character varying(50), "staff_lastname" character varying(50), "staff_firstname_kana" character varying(50), "staff_lastname_kana" character varying(50), "thumbnail" text, "postal_code" character varying(50), "region_id" integer, "municipalities" character varying(50), "address" character varying(50), "building_name" character varying(50), "telephone_number" character varying(13), CONSTRAINT "REL_af89a7103f6ec5c820d8bf3b43" UNIQUE ("user_id"), CONSTRAINT "PK_9d50813bf9f09ffbf3dd9a1b9d5" PRIMARY KEY ("id")); COMMENT ON COLUMN "corporate_profiles"."user_id" IS 'user.id'; COMMENT ON COLUMN "corporate_profiles"."region_id" IS 'regions.id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "type" smallint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."type" IS '1: individual, 2: corporate'`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_team_attributes" ADD CONSTRAINT "FK_711d4d3d69a72a58d884bfd88be" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_team_attributes" ADD CONSTRAINT "FK_4902e13f2624834488858888c60" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rewards" ADD CONSTRAINT "FK_7228b72ce7ee1765fce65d5a2ad" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" ADD CONSTRAINT "FK_c0424bc148c15c1ee716bd9950d" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_1bdffa25425538e630d8eb8a8bc" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_57a1f8699492fb94ce1352f787f" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "corporate_profiles" ADD CONSTRAINT "FK_af89a7103f6ec5c820d8bf3b437" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "corporate_profiles" DROP CONSTRAINT "FK_af89a7103f6ec5c820d8bf3b437"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_57a1f8699492fb94ce1352f787f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_1bdffa25425538e630d8eb8a8bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_gmo_attributes" DROP CONSTRAINT "FK_c0424bc148c15c1ee716bd9950d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rewards" DROP CONSTRAINT "FK_7228b72ce7ee1765fce65d5a2ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_team_attributes" DROP CONSTRAINT "FK_4902e13f2624834488858888c60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_team_attributes" DROP CONSTRAINT "FK_711d4d3d69a72a58d884bfd88be"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."type" IS '1: individual, 2: corporate'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TABLE "corporate_profiles"`);
    await queryRunner.query(`DROP TABLE "wallets"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "payment_gmo_attributes"`);
    await queryRunner.query(`DROP TABLE "purchases"`);
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(`DROP TABLE "purchase_team_attributes"`);
  }
}
