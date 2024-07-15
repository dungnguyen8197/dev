import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Organization } from 'src/entity/organization.entity';
import { Payment } from 'src/entity/payment.entity';
import { PaymentOrganizationSummariesService } from './payment-organization-summaries.service';
import { PaymentOrganizationSummaryRepository } from './payment-organization-summaries.repository';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Purchase,
      PurchaseTeamAttribute,
      Organization,
      PaymentOrganizationSummaryRepository,
    ]),
    LoggerModule,
  ],
  providers: [PaymentOrganizationSummariesService],
  exports: [PaymentOrganizationSummariesService],
})
export class PaymentOrganizationSummariesModule {}
