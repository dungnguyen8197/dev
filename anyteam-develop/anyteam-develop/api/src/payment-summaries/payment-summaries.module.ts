import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { PaymentCompetitionSummariesRepository } from 'src/payment-competition-summaries/payment-competition-summaries.repository';
import { PaymentCompetitionSummariesService } from 'src/payment-competition-summaries/payment-competition-summaries.service';
import { PaymentOrganizationSummariesService } from 'src/payment-organization-summaries/payment-organization-summaries.service';
import { PaymentOrganizationSummaryRepository } from 'src/payment-organization-summaries/payment-organization-summaries.repository';
import { PaymentSummariesController } from './payment-summaries.controller';
import { PaymentSummariesService } from './payment-summaries.service';
import { PaymentSupportOrganizationSummariesRepository } from 'src/payment-support-organization-summaries/payment-support-organization-summaries.repository';
import { PaymentSupportOrganizationSummariesService } from 'src/payment-support-organization-summaries/payment-support-organization-summaries.service';
import { PaymentSupportTeamSummariesRepository } from 'src/payment-support-team-summaries/payment-support-team-summaries.repository';
import { PaymentSupportTeamSummariesService } from 'src/payment-support-team-summaries/payment-support-team-summaries.service';
import { PaymentTeamSummariesService } from 'src/payment-team-summaries/payment-team-summaries.service';
import { PaymentTeamSummaryRepository } from 'src/payment-team-summaries/payment-team-summaries.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([
      PaymentCompetitionSummariesRepository,
      PaymentSupportOrganizationSummariesRepository,
      PaymentOrganizationSummaryRepository,
      PaymentSupportTeamSummariesRepository,
      PaymentTeamSummaryRepository,
    ]),
  ],
  controllers: [PaymentSummariesController],
  providers: [
    PaymentSummariesService,
    PaymentSupportOrganizationSummariesService,
    PaymentSupportTeamSummariesService,
    PaymentOrganizationSummariesService,
    PaymentTeamSummariesService,
    PaymentCompetitionSummariesService,
  ],
})
export class PaymentSummariesModule {}
