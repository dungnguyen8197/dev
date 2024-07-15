import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationDivisionTypesController } from './organization-division-types.controller';

describe('OrganizationDivisionTypesController', () => {
  let controller: OrganizationDivisionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationDivisionTypesController],
    }).compile();

    controller = module.get<OrganizationDivisionTypesController>(OrganizationDivisionTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
