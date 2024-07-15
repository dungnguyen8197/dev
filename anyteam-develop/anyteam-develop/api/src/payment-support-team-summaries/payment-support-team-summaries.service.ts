import * as moment from 'moment';

import { Connection, getManager } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { PaymentSupportTeamSummariesRepository } from './payment-support-team-summaries.repository';
import { PaymentSupportTeamSummary } from 'src/entity/payment-support-team-summary.entity';

@Injectable()
export class PaymentSupportTeamSummariesService {
  constructor(
    private paymentSupportTeamSummaryRepository: PaymentSupportTeamSummariesRepository,
    private connection: Connection,
  ) {}
  async handleSummary(currentDate: Date, startDate: string, endDate: string) {
    try {
      // TODO: 2.1) サマリテーブルの最新更新日時を取得
      const getMaxDate =
        await this.paymentSupportTeamSummaryRepository.findOne();
      const maxDate = getMaxDate
        ? moment(getMaxDate.updated_at).endOf('day')
        : null;
      // TODO: 2.2) 本日更新済みか判定（二重実行時の不整合対策）
      if (maxDate && moment(currentDate) <= maxDate) {
        return;
      } else {
        const listTotalMount =
          await this.paymentSupportTeamSummaryRepository.getTotalMountPaymentBySupportTeam(
            startDate,
            endDate,
          );
        this.updatePaymentSupportTeamSummary(
          listTotalMount,
          currentDate,
          startDate,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async updatePaymentSupportTeamSummary(
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
      // TODO: 2.3) 前日の支援者単位のチーム別支援金取得

      const listSummary = await this.getPaymentSupportTeamSummary(year, month);
      //TODO: 2.4) サマリテーブル追加更新
      listTotalMount.map((item) => {
        const checkSummary = listSummary.filter(
          (summary) =>
            item.user_id === summary.user_id &&
            item.team_id === summary.team_id,
        );
        if (checkSummary.length) {
          const summary = checkSummary[0];
          summary.amount =
            parseInt(summary.amount) + parseInt(item.total_amount);
          summary.updated_at = currentDate;
          queryRunner.manager.update(
            PaymentSupportTeamSummary,
            summary.id,
            summary,
          );
        } else {
          const summary = new PaymentSupportTeamSummary();
          summary.year = year;
          summary.month = month;
          summary.user_id = item.user_id;
          summary.team_id = item.team_id;
          summary.amount = item.total_amount;
          queryRunner.manager.insert(PaymentSupportTeamSummary, summary);
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

  async getPaymentSupportTeamSummary(year: number, month: number) {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .from(PaymentSupportTeamSummary, 'payment_support_team_summaries')
      .where('year = :year', { year: year })
      .andWhere('month = :month', { month: month });

    const result = await conditionQuery.getRawMany();
    return result;
  }
}
