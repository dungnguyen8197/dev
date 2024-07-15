import * as moment from 'moment';

import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

import { PaymentCompetitionSummariesService } from 'src/payment-competition-summaries/payment-competition-summaries.service';
import { PaymentOrganizationSummariesService } from 'src/payment-organization-summaries/payment-organization-summaries.service';
import { PaymentSupportOrganizationSummariesService } from 'src/payment-support-organization-summaries/payment-support-organization-summaries.service';
import { PaymentSupportTeamSummariesService } from 'src/payment-support-team-summaries/payment-support-team-summaries.service';
import { PaymentTeamSummariesService } from 'src/payment-team-summaries/payment-team-summaries.service';

@Injectable()
export class PaymentSummariesService {
  constructor(
    private readonly paymentSupportOrganizationSummariesService: PaymentSupportOrganizationSummariesService,
    private readonly paymentSupportTeamSummariesService: PaymentSupportTeamSummariesService,
    private readonly paymentOrganizationSummariesService: PaymentOrganizationSummariesService,
    private readonly paymentTeamSummariesService: PaymentTeamSummariesService,
    private readonly paymentCompetitionSummariesService: PaymentCompetitionSummariesService,
  ) {}
  private readonly logger = new Logger(PaymentSummariesService.name);

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    Logger.debug('Payment Summaries Cron 3AM: Start');
    try {
      const { currentDate, startDate, endDate } = await this.getDate();
      await this.paymentSupportOrganizationSummariesService.handleSummary(
        currentDate,
        startDate,
        endDate,
      );
      await this.paymentSupportTeamSummariesService.handleSummary(
        currentDate,
        startDate,
        endDate,
      );
      await this.paymentOrganizationSummariesService.handleSummary(
        currentDate,
        startDate,
        endDate,
      );
      await this.paymentTeamSummariesService.handleSummary(
        currentDate,
        startDate,
        endDate,
      );
      await this.paymentCompetitionSummariesService.handleSummary(
        currentDate,
        startDate,
        endDate,
      );
      Logger.debug('Payment Summaries Cron 3AM: End');
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getDate() {
    const currentDate = new Date();
    const startDate = moment(currentDate)
      .add(-1, 'day')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(currentDate)
      .add(-1, 'day')
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    return {
      currentDate,
      startDate,
      endDate,
    };
  }
}
