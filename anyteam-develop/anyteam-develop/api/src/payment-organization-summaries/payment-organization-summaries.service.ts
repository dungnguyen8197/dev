import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import * as moment from 'moment';
import { PaymentOrganizationSummary } from 'src/entity/payment-organization-summary.entity';
import { PaymentOrganizationSummaryRepository } from './payment-organization-summaries.repository';

@Injectable()
export class PaymentOrganizationSummariesService {
  constructor(
    @InjectRepository(PaymentOrganizationSummary)
    private paymentOrganizationSummaryRepository: PaymentOrganizationSummaryRepository,
    private connection: Connection,
  ) {}

  async handleSummary(currentDate: Date, startDate: string, endDate: string) {
    try {
      // TODO: 3.1) サマリテーブルの最新更新日時を取得
      const getMaxDate =
        await this.paymentOrganizationSummaryRepository.findOne();
      const maxDate = getMaxDate
        ? moment(getMaxDate.updated_at).endOf('day')
        : null;
      // TODO: 3.2) 本日更新済みか判定（二重実行時の不整合対策）
      if (maxDate && moment(currentDate) <= maxDate) {
        return;
      } else {
        const listTotalMount =
          await this.paymentOrganizationSummaryRepository.getTotalMountPaymentByOrganization(
            startDate,
            endDate,
          );
        this.updatePaymentOrganizationSummary(
          listTotalMount,
          currentDate,
          startDate,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async updatePaymentOrganizationSummary(
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
      // TODO: 3.3) 前日の組織別支援金取得

      const listSummary = await this.getPaymentOrganizationSummary(year, month);
      const listSummaryGroupByTeam = await this.groupBy(
        listTotalMount,
        'organization_id',
      );
      // TODO: 3.4) サマリテーブル追加更新
      listSummaryGroupByTeam.map((item) => {
        const checkSummary = listSummary.filter(
          (summary) => item.organization_id === summary.organization_id,
        );
        if (checkSummary.length) {
          const summary = checkSummary[0];
          summary.amount =
            parseInt(summary.amount) + parseInt(item.total_amount);
          summary.general_support_count += item.general_support_count;
          summary.general_support_amount += item.general_support_amount;
          summary.subscription_support_count += item.subscription_support_count;
          summary.subscription_support_amount +=
            item.subscription_support_amount;
          summary.updated_at = currentDate;
          queryRunner.manager.update(
            PaymentOrganizationSummary,
            summary.id,
            summary,
          );
        } else {
          const summary = new PaymentOrganizationSummary();
          summary.year = year;
          summary.month = month;
          summary.organization_id = item.organization_id;
          summary.amount = item.total_amount;
          summary.general_support_count = item.general_support_count;
          summary.general_support_amount = item.general_support_amount;
          summary.subscription_support_count = item.subscription_support_count;
          summary.subscription_support_amount =
            item.subscription_support_amount;
          queryRunner.manager.insert(PaymentOrganizationSummary, summary);
        }
      });
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getPaymentOrganizationSummary(year: number, month: number) {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .from(PaymentOrganizationSummary, 'payment_organization_summaries')
      .where('year = :year', { year: year })
      .andWhere('month = :month', { month: month });

    const result = await conditionQuery.getRawMany();
    return result;
  }

  async groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      const key = obj[property];
      if (!acc[key]) {
        obj.total_amount = 0;
        obj.general_support_count = 0;
        obj.general_support_amount = 0;
        obj.subscription_support_count = 0;
        obj.subscription_support_amount = 0;

        acc[key] = obj;
      }
      if (obj.purchase_type === 1) {
        acc[key].general_support_count += 1;
        acc[key].general_support_amount += obj.payments_amount;
      } else if (obj.purchase_type === 2) {
        acc[key].subscription_support_count += 1;
        acc[key].subscription_support_amount += obj.payments_amount;
      }
      acc[key].total_amount += obj.payments_amount;
      return acc;
    }, []);
  }
}
