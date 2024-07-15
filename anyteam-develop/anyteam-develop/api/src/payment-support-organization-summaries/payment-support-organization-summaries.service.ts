import * as moment from 'moment';

import { Connection, getManager } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { PaymentSupportOrganizationSummariesRepository } from './payment-support-organization-summaries.repository';
import { PaymentSupportOrganizationSummary } from 'src/entity/payment-support-organization-summary.entity';

@Injectable()
export class PaymentSupportOrganizationSummariesService {
  constructor(
    private paymentSupportOrganizationSummaryRepository: PaymentSupportOrganizationSummariesRepository,
    private connection: Connection,
  ) {}

  async handleSummary(currentDate: Date, startDate: string, endDate: string) {
    try {
      // TODO: 1.1) サマリテーブルの最新更新日時を取得
      const getMaxDate =
        await this.paymentSupportOrganizationSummaryRepository.findOne();
      const maxDate = getMaxDate
        ? moment(getMaxDate.updated_at).endOf('day')
        : null;
      // TODO: 1.2) 本日更新済みか判定（二重実行時の不整合対策）
      if (maxDate && moment(currentDate) <= maxDate) {
        return;
      } else {
        const listTotalMount =
          await this.paymentSupportOrganizationSummaryRepository.getTotalMountPaymentBySupportOrganization(
            startDate,
            endDate,
          );

        this.updatePaymentSupportOrganizationSummary(
          listTotalMount,
          currentDate,
          startDate,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async updatePaymentSupportOrganizationSummary(
    listTotalMount: any,
    currentDate: Date,
    startDate: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const year = parseInt(moment(startDate).format('YYYY'));
      const month = parseInt(moment(startDate).format('MM'));

      // TODO: 1.3) 前日の支援者単位の組織別支援金取得
      const listSummary = await this.getPaymentSupportOrganizationSummary(
        year,
        month,
      );

      //TODO: 1.4) サマリテーブル追加更新
      listTotalMount.map((item) => {
        const checkSummary = listSummary.filter(
          (summary) =>
            item.user_id === summary.user_id &&
            item.organization_id === summary.organization_id,
        );
        if (checkSummary.length) {
          const summary = checkSummary[0];
          summary.amount =
            parseInt(summary.amount) + parseInt(item.total_amount);
          summary.updated_at = currentDate;
          queryRunner.manager.update(
            PaymentSupportOrganizationSummary,
            summary.id,
            summary,
          );
        } else {
          const summary = new PaymentSupportOrganizationSummary();
          summary.year = year;
          summary.month = month;
          summary.user_id = item.user_id;
          summary.organization_id = item.organization_id;
          summary.amount = item.total_amount;
          queryRunner.manager.insert(
            PaymentSupportOrganizationSummary,
            summary,
          );
        }
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getPaymentSupportOrganizationSummary(year: number, month: number) {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .from(
        PaymentSupportOrganizationSummary,
        'payment_support_organization_summaries',
      )
      .where('year = :year', { year: year })
      .andWhere('month = :month', { month: month });

    const result = await conditionQuery.getRawMany();
    return result;
  }
}
