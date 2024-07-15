import { Test, TestingModule } from '@nestjs/testing';
import { PaymentCompetitionSummariesService } from './payment-competition-summaries.service';

describe('PaymentCompetitionSummariesService', () => {
  let service: PaymentCompetitionSummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentCompetitionSummariesService],
    }).compile();

    service = module.get<PaymentCompetitionSummariesService>(
      PaymentCompetitionSummariesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
