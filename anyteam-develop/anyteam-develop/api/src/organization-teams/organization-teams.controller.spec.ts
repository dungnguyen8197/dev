import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationTeamsController } from './organization-teams.controller';

describe('OrganizationTeamsController', () => {
  let controller: OrganizationTeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationTeamsController],
    }).compile();

    controller = module.get<OrganizationTeamsController>(OrganizationTeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
