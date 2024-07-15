import { Test, TestingModule } from '@nestjs/testing';
import { FinancialInstitutionsController } from './financial-institutions.controller';

describe('FinancialInstitutionsController', () => {
  let controller: FinancialInstitutionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialInstitutionsController],
    }).compile();

    controller = module.get<FinancialInstitutionsController>(
      FinancialInstitutionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
