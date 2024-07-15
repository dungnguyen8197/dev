import { Test, TestingModule } from '@nestjs/testing';
import { UserRegisterTransactionService } from './user-register-transactions.service';

describe('UserRegisterTransactionService', () => {
  let service: UserRegisterTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRegisterTransactionService],
    }).compile();

    service = module.get<UserRegisterTransactionService>(UserRegisterTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
