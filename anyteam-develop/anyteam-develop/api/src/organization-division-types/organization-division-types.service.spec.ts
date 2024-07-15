import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationDivisionTypesService } from './organization-division-types.service';

describe('OrganizationDivisionTypeService', () => {
  let service: OrganizationDivisionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationDivisionTypesService],
    }).compile();

    service = module.get<OrganizationDivisionTypesService>(OrganizationDivisionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
