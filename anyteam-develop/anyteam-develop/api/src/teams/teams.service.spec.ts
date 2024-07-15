import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from '../entity/team.entity';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { TeamsService } from './teams.service';
import { CustomLogger } from '../logger/logger.service';
import { User } from '../entity/user.entity';
import { TeamRegisterRequest, TeamRegisterResponse } from './dto/register.dto';
import { TeamEntity } from '../domain/entity/team';
import { GetListRequest } from './dto/teams.dto';
import { TeamList } from '../domain/entity/team/list';
import { FindTeamByNameRequest, FindTeamByNameResponse } from './dto/find.dto';

const qr = {
  manager: {},
} as QueryRunner;

class ConnectionMock {
  createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
    return qr;
  }
}

describe('TeamsService', () => {
  let service: TeamsService;
  let connection: Connection;
  let teamsRepository: Repository<Team>;

  beforeEach(async () => {
    Object.assign(qr.manager, {
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    });
    qr.connect = jest.fn();
    qr.release = jest.fn();
    qr.startTransaction = jest.fn();
    qr.commitTransaction = jest.fn();
    qr.rollbackTransaction = jest.fn();
    qr.release = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useClass: Repository },
        { provide: CustomLogger, useClass: Repository },
        { provide: Connection, useClass: ConnectionMock },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    connection = module.get<Connection>(Connection);
    teamsRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Team', () => {
    const userTest = new User();
    userTest.email = 'lockerz_nokasoft@gmail.com';

    let userPayload = {
      organizationUserId: 1,
      email: userTest.email,
    };

    const teamRegisterTest = {
      identifiers: [{ id: 1 }],
      generatedMaps: [
        {
          id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      raw: [
        {
          id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    };

    const teamRegisterRequest = new TeamRegisterRequest();
    teamRegisterRequest.name = 'Team 1';

    const teamTest = new Team();
    teamTest.status = 1;
    teamTest.name = 'Team 1';

    const teamProfileListTest = [teamTest];

    it('Register new team.', async () => {
      const teamEntityTest = new TeamEntity(
        teamRegisterTest.identifiers[0].id,
        teamTest.status,
        teamTest.name,
      );

      const teamEntityListTest = [teamEntityTest];
      const teamRegisterResponseTest = new TeamRegisterResponse(
        teamEntityListTest[0],
      );

      const queryRunner = connection.createQueryRunner();
      jest
        .spyOn(queryRunner.manager, 'insert')
        .mockResolvedValueOnce(teamRegisterTest);

      expect(await service.register(userPayload, teamRegisterRequest)).toEqual(
        teamRegisterResponseTest,
      );
    });

    it('Get team list.', async () => {
      const getListRequest = new GetListRequest();
      getListRequest.limit = 10;
      getListRequest.offset = 0;

      const teamEntityTest = new TeamEntity(
        teamTest.id,
        teamTest.status,
        teamTest.name,
      );

      const teamEntityListTest = [teamEntityTest];
      jest.spyOn(teamsRepository, 'find').mockResolvedValueOnce([teamTest]);
      expect(await service.getList(getListRequest)).toEqual(
        new TeamList(teamEntityListTest, 1, 0),
      );
    });

    it('Find team profile list by name.', async () => {
      const findTeamByNameRequest = new FindTeamByNameRequest();
      findTeamByNameRequest.name = teamTest.name;

      const findTeamByNameResponseTest = new FindTeamByNameResponse(
        teamProfileListTest,
      );

      jest
        .spyOn(teamsRepository, 'find')
        .mockResolvedValueOnce(teamProfileListTest);
      expect(await service.getListByName(findTeamByNameRequest)).toEqual(
        findTeamByNameResponseTest,
      );
    });

    it('Find all team.', async () => {
      const getListRequest = new GetListRequest();
      getListRequest.limit = 10;
      getListRequest.offset = 0;

      jest.spyOn(teamsRepository, 'find').mockResolvedValueOnce([teamTest]);
      expect(
        await service.findAll(getListRequest.limit, getListRequest.offset),
      ).toEqual([teamTest]);
    });

    it('Find team by name.', async () => {
      const findTeamByNameRequest = new FindTeamByNameRequest();
      findTeamByNameRequest.name = teamTest.name;
      jest
        .spyOn(teamsRepository, 'find')
        .mockResolvedValueOnce(teamProfileListTest);
      expect(await service.findByName(findTeamByNameRequest.name)).toEqual(
        teamProfileListTest,
      );
    });
  });
});
