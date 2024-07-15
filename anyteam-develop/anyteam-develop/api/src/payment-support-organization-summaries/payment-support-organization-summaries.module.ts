import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Payment } from 'src/entity/payment.entity';
import { PaymentSupportOrganizationSummariesRepository } from './payment-support-organization-summaries.repository';
import { PaymentSupportOrganizationSummariesService } from './payment-support-organization-summaries.service';
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
      PaymentSupportOrganizationSummariesRepository,
    ]),
    LoggerModule,
  ],
  providers: [PaymentSupportOrganizationSummariesService],
  exports: [PaymentSupportOrganizationSummariesService],
})
export class PaymentSupportOrganizationSummariesModule {}
