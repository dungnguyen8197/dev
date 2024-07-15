import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSupportOrganizationSummariesService } from './payment-support-organization-summaries.service';

describe('PaymentSupportOrganizationSummariesService', () => {
  let service: PaymentSupportOrganizationSummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentSupportOrganizationSummariesService],
    }).compile();

    service = module.get<PaymentSupportOrganizationSummariesService>(PaymentSupportOrganizationSummariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
