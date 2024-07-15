import { EmailService } from 'src/email/email.service';
import { FilesService } from 'src/files/files.service';
import { GmoService } from 'src/gmo/gmo.service';
import { HttpModule } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Payment } from 'src/entity/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserEmailUpdateTransactionsModule } from 'src/user-email-update-transactions/user-email-update-transactions.module';
import { UserProfile } from 'src/entity/user-profile.entity';
import { UserRegisterTransactionModule } from 'src/user-register-transactions/user-register-transactions.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Wallet } from 'src/entity/wallet.entity';
import { PurchaseRepository } from '../purchases/purchases.repository';
import { Team } from 'src/entity/team.entity';

@Module({
  // UserエンティティをUsersServiceで使えるようにする
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      Payment,
      Wallet,
      Team,
      PurchaseRepository,
    ]),
    UserRegisterTransactionModule,
    UserEmailUpdateTransactionsModule,
    HttpModule,
    LoggerModule,
  ],

  // exportsするために必要
  // UsersModule内で使うために必要
  providers: [UsersService, EmailService, FilesService, GmoService],

  // UsersServiceを別のクラスからも使えるようにする
  exports: [UsersService],

  controllers: [UsersController],
})
export class UsersModule {}
