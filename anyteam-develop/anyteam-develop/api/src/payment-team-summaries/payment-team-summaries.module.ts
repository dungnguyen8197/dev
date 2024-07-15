import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Payment } from 'src/entity/payment.entity';
import { PaymentTeamSummariesService } from './payment-team-summaries.service';
import { PaymentTeamSummaryRepository } from './payment-team-summaries.repository';
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
      PaymentTeamSummaryRepository,
    ]),
    LoggerModule,
  ],
  providers: [PaymentTeamSummariesService],
})
export class PaymentTeamSummariesModule {}
