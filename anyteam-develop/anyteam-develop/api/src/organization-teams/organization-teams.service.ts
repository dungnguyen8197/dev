import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationTeamEntity } from 'src/domain/entity/organization-team';
import { OrganizationTeamList } from 'src/domain/entity/organization-team/list';
import { TeamEntity } from 'src/domain/entity/team';
import { OrganizationUser } from 'src/entity/organization-user.entity';
import { Organization } from 'src/entity/organization.entity';
import { CustomLogger } from 'src/logger/logger.service';
import { JwtPayload } from 'src/organization-users/organization-users.service';
import { Repository } from 'typeorm';
import { GetListRequest } from './dto/list.dto';
import { OrganizationTeamUpdateRequest } from './dto/organization-team-update.dto';
import { OrganizationTeamsRepository } from './organization-teams.repository';

@Injectable()
export class OrganizationTeamsService {
  constructor(
    private teamsRepository: OrganizationTeamsRepository,
    @InjectRepository(OrganizationUser)
    private organizationUserRepository: Repository<OrganizationUser>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private logger: CustomLogger,
  ) {}

  async getList(
    organization_id: number,
    req: GetListRequest,
  ): Promise<OrganizationTeamList> {
    try {
      const teamEntityList = (
        await this.teamsRepository.findOrganizationTeam(organization_id, req)
      ).map((team) => {
        return new OrganizationTeamEntity(
          team.id,
          team.status,
          team.name,
          team.competition_id,
        );
      });
      return new OrganizationTeamList(teamEntityList);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async update(
    organization_id: number,
    organizationTeamsRequest: OrganizationTeamUpdateRequest[],
  ): Promise<any> {
    try {
      const organization = await this.organizationsRepository.findOne(
        organization_id,
        { relations: ['organization_teams'] },
      );

      if (!organization) {
        throw new BadRequestException();
      }

      await this.updateOrCreateOrganizationTeams(
        organization_id,
        organizationTeamsRequest,
      );
      return;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateOrCreateOrganizationTeams(
    organization_id: number,
    organizationTeamsRequest: OrganizationTeamUpdateRequest[],
  ): Promise<any> {
    return Promise.all(
      organizationTeamsRequest.map(async (team) => {
        if (team.id) {
          await this.teamsRepository.updateOrganizationTeam(team);
        } else {
          await this.teamsRepository.createOrganizationTeam(
            organization_id,
            team,
          );
        }
      }),
    );
  }

  async deleteOrganizationTeams(
    organization_id: number,
    listTeamDelete: number[],
  ): Promise<any> {
    const organizationTeamsList = await this.teamsRepository
      .find({
        where: { organization_id: organization_id },
        select: ['id'],
      })
      .then((res) => res.map((team) => team.id));

    const checkOrganizationRole = listTeamDelete.filter(
      (team) => !organizationTeamsList.includes(team),
    );

    if (checkOrganizationRole.length > 0) {
      throw new BadRequestException();
    }

    await this.teamsRepository.deleteOrganizationTeams(listTeamDelete);
    return;
  }
}
