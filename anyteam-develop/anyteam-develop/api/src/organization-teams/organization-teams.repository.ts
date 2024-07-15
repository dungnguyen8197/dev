import { TEAM_STATUS_ACTIVE } from 'src/domain/value-object/team/status';
import { Team } from 'src/entity/team.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { GetListRequest } from './dto/list.dto';
import { OrganizationTeamUpdateRequest } from './dto/organization-team-update.dto';

@EntityRepository(Team)
export class OrganizationTeamsRepository extends Repository<Team> {
  async updateOrganizationTeam(
    req: OrganizationTeamUpdateRequest,
  ): Promise<Team> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const organizationTeamEntity = new Team();
      organizationTeamEntity.status = req.status;
      organizationTeamEntity.name = req.name;
      organizationTeamEntity.competition_id = req.competition_id;

      await queryRunner.manager.update(
        Team,
        { id: req.id, enabled: true },
        organizationTeamEntity,
      );
      await queryRunner.commitTransaction();

      return organizationTeamEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createOrganizationTeam(
    organization_id: number,
    req: OrganizationTeamUpdateRequest,
  ): Promise<Team> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const organizationTeamEntity = new Team();
      organizationTeamEntity.status = req.status;
      organizationTeamEntity.name = req.name;
      organizationTeamEntity.organization_id = organization_id;
      organizationTeamEntity.competition_id = req.competition_id;

      await queryRunner.manager.save(Team, organizationTeamEntity);
      await queryRunner.commitTransaction();

      return organizationTeamEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findOrganizationTeam(organization_id: number, query: GetListRequest) {
    const conditionQuery = this.createQueryBuilder('teams');
    conditionQuery.where('teams.organization_id = :organization_id', {
      organization_id,
    });
    conditionQuery.andWhere('teams.enabled = :enabled', { enabled: true });

    if (!query.scope || query.scope !== 'all') {
      conditionQuery.andWhere('teams.status = :status', {
        status: TEAM_STATUS_ACTIVE,
      });
    }

    return await conditionQuery
      .orderBy('teams.id') // order by id ASC
      .getMany();
  }

  async deleteOrganizationTeams(listTeamDelete: number[]) {
    const conditionQuery = this.createQueryBuilder('teams');
    await conditionQuery
      .update(Team)
      .set({ enabled: false })
      .whereInIds(listTeamDelete)
      .execute();
    return;
  }

  async findTeam(id: number, status: number = null, enabled: boolean = null) {
    const conditionQuery = this.createQueryBuilder('teams')
      .leftJoinAndSelect('teams.organization', 'organization')
      .leftJoinAndSelect('teams.competition', 'competition')
      .leftJoinAndSelect(
        'organization.organization_division_type',
        'organization_division_type',
      )
      .leftJoinAndSelect('organization.region', 'region');

    if (status !== null) {
      conditionQuery.andWhere('teams.status = :status', { status: status });
    }

    if (enabled !== null) {
      conditionQuery.andWhere('teams.enabled = :enabled', {
        enabled: enabled,
      });
    }

    const team = await conditionQuery
      .where('teams.id = :id', { id: id })
      .getOne();

    return team;
  }
}
