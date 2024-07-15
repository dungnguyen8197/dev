import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSupportTeamSummariesService } from './payment-support-team-summaries.service';

describe('PaymentSupportTeamSummariesService', () => {
  let service: PaymentSupportTeamSummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentSupportTeamSummariesService],
    }).compile();

    service = module.get<PaymentSupportTeamSummariesService>(PaymentSupportTeamSummariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
