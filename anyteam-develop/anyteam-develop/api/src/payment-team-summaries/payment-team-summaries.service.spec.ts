import { Test, TestingModule } from '@nestjs/testing';
import { PaymentTeamSummariesService } from './payment-team-summaries.service';

describe('PaymentTeamSummariesService', () => {
  let service: PaymentTeamSummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentTeamSummariesService],
    }).compile();

    service = module.get<PaymentTeamSummariesService>(PaymentTeamSummariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
