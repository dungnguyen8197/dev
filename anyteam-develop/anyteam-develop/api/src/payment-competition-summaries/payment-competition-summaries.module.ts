import { Competition } from 'src/entity/competition.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Payment } from 'src/entity/payment.entity';
import { PaymentCompetitionSummariesRepository } from './payment-competition-summaries.repository';
import { PaymentCompetitionSummariesService } from './payment-competition-summaries.service';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { Team } from 'src/entity/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Purchase,
      PurchaseTeamAttribute,
      Team,
      Competition,
      PaymentCompetitionSummariesRepository,
    ]),
    LoggerModule,
  ],
  providers: [PaymentCompetitionSummariesService],
})
export class PaymentCompetitionSummariesModule {}
