import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRegisterTransaction } from 'src/entity/user-register-transaction.entity';
import { UserRegisterTransactionService } from './user-register-transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRegisterTransaction])],
  providers: [UserRegisterTransactionService],
  exports: [UserRegisterTransactionService]
})
export class UserRegisterTransactionModule {}
