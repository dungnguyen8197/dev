import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamEntity } from '../domain/entity/team';
import { TeamList } from '../domain/entity/team/list';
import {
  TeamStatusVo,
  TEAM_STATUS_ACTIVE,
} from '../domain/value-object/team/status';
import { Team } from '../entity/team.entity';
import { CustomLogger } from '../logger/logger.service';
import { Connection, Repository } from 'typeorm';
import {
  FindTeamByNameRequest,
  FindTeamByNameResponse,
  FindTeamByIdResponse,
} from '../teams/dto/find.dto';
import { TeamRegisterRequest, TeamRegisterResponse } from './dto/register.dto';
import { GetListRequest } from './dto/teams.dto';
import { OrganizationTeamsRepository } from '../organization-teams/organization-teams.repository';

import { OrganizationUserJWTPayload } from 'src/organization-users/jwt-organization-user.strategy';
import { OrganizationUser } from 'src/entity/organization-user.entity';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepository: OrganizationTeamsRepository,
    @InjectRepository(OrganizationUser)
    private organizationUserRepository: Repository<OrganizationUser>,
    private connection: Connection,
    private logger: CustomLogger,
  ) {}

  async register(
    payload: OrganizationUserJWTPayload,
    req: TeamRegisterRequest,
  ): Promise<TeamRegisterResponse> {
    const name = req.name;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teamEntity = new Team();
      const statusVo = new TeamStatusVo(TEAM_STATUS_ACTIVE);
      const organizationUser = await this.organizationUserRepository.findOne(
        payload.organizationUserId,
      );

      teamEntity.status = statusVo.getValue();
      teamEntity.organization_id = organizationUser.organization_id;
      teamEntity.competition_id = req.competition_id;
      teamEntity.name = req.name;

      const team = await queryRunner.manager.insert(Team, teamEntity);

      const teamEntityList = <TeamEntity[]>team.identifiers.map(
        (identifier) => {
          if (!identifier.id) {
            throw new BadRequestException();
          }
          return new TeamEntity(identifier.id, statusVo.getValue(), name);
        },
      );

      if (!teamEntityList[0]) {
        throw new NotFoundException();
      }
      await queryRunner.commitTransaction();
      return new TeamRegisterResponse(teamEntityList[0]);
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getList(req: GetListRequest): Promise<TeamList> {
    const offset = Number(req.offset) || 0; // TODO: 定数化

    try {
      const teamEntityList = (await this.findAll(offset, req.limit)).map(
        (team) => {
          return new TeamEntity(team.id, team.status, team.name);
        },
      );
      const countTeams = await this.teamsRepository.count();
      return new TeamList(teamEntityList, countTeams, offset);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getListByName(req: FindTeamByNameRequest): Promise<any> {
    try {
      const teamProfileEntityList = await this.findByName(req.name);
      return new FindTeamByNameResponse(teamProfileEntityList);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(offset: number, limit: number): Promise<Team[]> {
    return await this.teamsRepository.find({
      select: ['id', 'status', 'name'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit || 5, // TODO: 定数化
    });
  }

  // 完全一致
  async findByName(name: string): Promise<Team[]> {
    return await this.teamsRepository.find({ where: { name } });
  }

  async findById(id: number): Promise<FindTeamByIdResponse> {
    try {
      const team = await this.teamsRepository.findTeam(
        id,
        TEAM_STATUS_ACTIVE,
        true,
      );

      if (!team) {
        throw new BadRequestException();
      }

      return new FindTeamByIdResponse(team);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }
  }
}
