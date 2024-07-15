import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Payment } from 'src/entity/payment.entity';
import { PaymentSupportTeamSummariesRepository } from './payment-support-team-summaries.repository';
import { PaymentSupportTeamSummariesService } from './payment-support-team-summaries.service';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { Team } from 'src/entity/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Wallet } from 'src/entity/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Purchase,
      PurchaseTeamAttribute,
      Team,
      User,
      Wallet,
      PaymentSupportTeamSummariesRepository,
    ]),
    LoggerModule,
  ],
  providers: [PaymentSupportTeamSummariesService],
  exports: [PaymentSupportTeamSummariesService],
})
export class PaymentSupportTeamSummariesModule {}
