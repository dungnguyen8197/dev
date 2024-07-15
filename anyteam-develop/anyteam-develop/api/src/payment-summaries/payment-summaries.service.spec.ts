import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSummariesService } from './payment-summaries.service';

describe('PaymentSummariesService', () => {
  let service: PaymentSummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentSummariesService],
    }).compile();

    service = module.get<PaymentSummariesService>(PaymentSummariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
