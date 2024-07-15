import { EmailService } from 'src/email/email.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserEmailUpdateTransaction } from 'src/entity/user-email-update-transaction.entity';
import { UserEmailUpdateTransactionsService } from './user-email-update-transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEmailUpdateTransaction, User])],
  providers: [UserEmailUpdateTransactionsService, EmailService],
  exports: [UserEmailUpdateTransactionsService],
})
export class UserEmailUpdateTransactionsModule {}
