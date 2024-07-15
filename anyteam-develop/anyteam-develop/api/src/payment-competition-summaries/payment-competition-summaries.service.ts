import * as moment from 'moment';

import { Connection, getManager } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaymentCompetitionSummariesRepository } from './payment-competition-summaries.repository';
import { PaymentCompetitionSummary } from 'src/entity/payment-competition-summary.entity';

@Injectable()
export class PaymentCompetitionSummariesService {
  constructor(
    private paymentCompetitionSummaryRepository: PaymentCompetitionSummariesRepository,
    private connection: Connection,
  ) {}

  async handleSummary(currentDate: Date, startDate: string, endDate: string) {
    try {
      // TODO: 5.1) サマリテーブルの最新更新日時を取得
      const getMaxDate =
        await this.paymentCompetitionSummaryRepository.findOne();
      const maxDate = getMaxDate
        ? moment(getMaxDate.updated_at).endOf('day')
        : null;
      // TODO: 5.2) 本日更新済みか判定（二重実行時の不整合対策）
      if (maxDate && moment(currentDate) <= maxDate) {
        return;
      } else {
        const listTotalMount =
          await this.paymentCompetitionSummaryRepository.getTotalMountPaymentByCompetition(
            startDate,
            endDate,
          );
        this.updatePaymentCompetitionSummary(
          listTotalMount,
          currentDate,
          startDate,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async updatePaymentCompetitionSummary(
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

      // TODO: 5.3) 前日の競技別支援金取得
      const listSummary = await this.getPaymentCompetitionSummary(year, month);

      //TODO: 5.4) サマリテーブル追加更新
      listTotalMount.map((item) => {
        const checkSummary = listSummary.filter(
          (summary) => item.competition_id === summary.competition_id,
        );
        if (checkSummary.length) {
          const summary = checkSummary[0];
          summary.amount =
            parseInt(summary.amount) + parseInt(item.total_amount);
          summary.updated_at = currentDate;
          queryRunner.manager.update(
            PaymentCompetitionSummary,
            summary.id,
            summary,
          );
        } else {
          const summary = new PaymentCompetitionSummary();
          summary.year = year;
          summary.month = month;
          summary.competition_id = item.competition_id;
          summary.amount = item.total_amount;
          queryRunner.manager.insert(PaymentCompetitionSummary, summary);
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

  async getPaymentCompetitionSummary(year: number, month: number) {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .from(PaymentCompetitionSummary, 'payment_competition_summaries')
      .where('year = :year', { year: year })
      .andWhere('month = :month', { month: month });

    const result = await conditionQuery.getRawMany();
    return result;
  }
}
