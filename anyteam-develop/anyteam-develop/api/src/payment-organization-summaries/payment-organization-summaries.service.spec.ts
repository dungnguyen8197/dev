import { Test, TestingModule } from '@nestjs/testing';
import { PaymentOrganizationSummariesService } from './payment-organization-summaries.service';

describe('PaymentOrganizationSummariesService', () => {
  let service: PaymentOrganizationSummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentOrganizationSummariesService],
    }).compile();

    service = module.get<PaymentOrganizationSummariesService>(PaymentOrganizationSummariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
