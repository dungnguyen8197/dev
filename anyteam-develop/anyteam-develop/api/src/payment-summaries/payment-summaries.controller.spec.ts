import { Test, TestingModule } from '@nestjs/testing';

import { PaymentSummariesController } from './payment-summaries.controller';
import { PaymentSummariesService } from './payment-summaries.service';

describe('PaymentSummariesController', () => {
  let controller: PaymentSummariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentSummariesController],
      providers: [PaymentSummariesService],
    }).compile();

    controller = module.get<PaymentSummariesController>(
      PaymentSummariesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
