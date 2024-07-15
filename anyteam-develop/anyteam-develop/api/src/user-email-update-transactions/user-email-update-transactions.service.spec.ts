import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailUpdateTransactionsService } from './user-email-update-transactions.service';

describe('UserEmailUpdateTransactionsService', () => {
  let service: UserEmailUpdateTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEmailUpdateTransactionsService],
    }).compile();

    service = module.get<UserEmailUpdateTransactionsService>(UserEmailUpdateTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
