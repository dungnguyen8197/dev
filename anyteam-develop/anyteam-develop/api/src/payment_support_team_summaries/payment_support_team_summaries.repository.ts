import { Organization } from 'src/entity/organization.entity';
import { PaymentSupportTeamSummary } from 'src/entity/payment-support-team-summary.entity';
import { Region } from 'src/entity/region.entity';
import { Team } from 'src/entity/team.entity';
import { UserProfile } from 'src/entity/user-profile.entity';
import { GetOrganizationSupportersRequest } from 'src/organizations/dto/organization-supporters.dto';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PaymentSupportTeamSummary)
export class PaymentSupportTeamSummaryRepository extends Repository<PaymentSupportTeamSummary> {
  async getSupporterList(
    req: GetOrganizationSupportersRequest,
    organizationId: number,
  ) {
    const conditionQuery = this.createQueryBuilder(
      'payment_support_team_summaries',
    )
      .select([
        'user_profiles.id',
        'user_profiles.user_id as user_id',
        'user_profiles.firstname as user_firstname',
        'user_profiles.lastname as user_lastname',
        'user_profiles.birthday as birthday',
        'user_profiles.thumbnail as thumbnail',
        'regions.id as region_id',
        'regions.name as region_name',
        'json_agg(teams.name) as teams',
      ])
      .innerJoin(
        UserProfile,
        'user_profiles',
        'user_profiles.user_id = payment_support_team_summaries.user_id',
      )
      .innerJoin(
        Team,
        'teams',
        'payment_support_team_summaries.team_id = teams.id',
      )
      .innerJoin(Region, 'regions', 'user_profiles.region_id = regions.id')
      .andWhere('teams.organization_id = :organizationId', {
        organizationId: organizationId,
      })
      .andWhere('payment_support_team_summaries.year = :year', {
        year: req.year,
      });
    if (req.month) {
      conditionQuery.andWhere('payment_support_team_summaries.month = :month', {
        month: req.month,
      });
    }

    if (req.teams) {
      conditionQuery.andWhere(
        'payment_support_team_summaries.team_id IN (:...teams)',
        { teams: req.teams },
      );
    }

    if (req.regions) {
      conditionQuery.andWhere('regions.id IN (:...regions)', {
        regions: req.regions,
      });
    }

    let sortColumn = '';
    switch (req.sort_column) {
      case 'age':
        sortColumn = 'user_profiles.birthday';
        break;
      default:
        sortColumn = 'user_profiles.lastname, user_profiles.firstname';
        break;
    }

    conditionQuery.groupBy('user_profiles.id').addGroupBy('regions.id');

    const total = (await conditionQuery.getRawMany()).length;
    const results = await conditionQuery
      .orderBy(sortColumn, req.sort_type === 'desc' ? 'DESC' : 'ASC')
      .limit(req.limit || 20)
      .offset(req.offset || 0)
      .getRawMany();

    return {
      organizationSupporters: results,
      total: total,
    };
  }
}
