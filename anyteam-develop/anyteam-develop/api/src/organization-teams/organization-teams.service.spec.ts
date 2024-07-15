import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationTeamsService } from './organization-teams.service';

describe('OrganizationTeamService', () => {
  let service: OrganizationTeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationTeamsService],
    }).compile();

    service = module.get<OrganizationTeamsService>(OrganizationTeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
