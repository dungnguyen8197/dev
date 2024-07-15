import { FilesService } from 'src/files/files.service';
import { LoggerModule } from 'src/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PurchaseRepository } from './purchases.repository';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { Reward } from 'src/entity/reward.entity';
import { Team } from 'src/entity/team.entity';
import { User } from 'src/entity/user.entity';
import { PaymentTransaction } from 'src/entity/payment_transaction.entity';
import { GmoModule } from '../gmo/gmo.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([
      User,
      PurchaseRepository,
      Reward,
      Team,
      PaymentTransaction,
    ]),
    GmoModule,
  ],
  providers: [PurchasesService, FilesService, EmailService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
