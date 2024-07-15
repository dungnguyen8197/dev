import { EntityRepository, Repository, getManager } from 'typeorm';
import {
  GetTeamSupportRequest,
  GetTeamTotalSupportRequest,
} from './../organizations/dto/organization-support.dto';

import { Payment } from 'src/entity/payment.entity';
import { PaymentTeamSummary } from './../entity/payment-team-summary.entity';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { Team } from 'src/entity/team.entity';

@EntityRepository(PaymentTeamSummary)
export class PaymentTeamSummaryRepository extends Repository<PaymentTeamSummary> {
  async findOne(): Promise<PaymentTeamSummary> {
    const result = await this.createQueryBuilder('payment_team_summaries')
      .orderBy('payment_team_summaries.id', 'DESC')
      .getOne();

    return result;
  }

  async getTotalMountPaymentByTeam(
    startDate: string,
    endDate: string,
  ): Promise<PaymentTeamSummary[]> {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .from(Payment, 'payments')
      .select('teams.id', 'team_id')
      .addSelect('payments.amount as payments_amount')
      .addSelect('purchases.type as purchase_type')
      .innerJoin(Purchase, 'purchases', 'payments.purchase_id = purchases.id')
      .innerJoin(
        PurchaseTeamAttribute,
        'purchase_team_attributes',
        'purchases.id = purchase_team_attributes.purchase_id',
      )
      .innerJoin(Team, 'teams', 'teams.id = purchase_team_attributes.team_id')
      .where('payments.updated_at BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      });
    const result = await conditionQuery.getRawMany();
    return result;
  }

  async getTeamSupportTotal(
    organization_id: number,
    query: GetTeamTotalSupportRequest,
  ): Promise<any> {
    const conditionQuery = this.createQueryBuilder('payment_team_summaries')
      .leftJoinAndSelect('payment_team_summaries.team', 'team')
      .andWhere('team.organization_id = :organization_id', {
        organization_id: organization_id,
      })
      .andWhere('payment_team_summaries.year = :year', {
        year: query.year,
      });

    if (query.month) {
      conditionQuery.andWhere('payment_team_summaries.month = :month', {
        month: query.month,
      });
    }

    const paymentOrganizationSummaryRepository = await conditionQuery
      .select('SUM(payment_team_summaries.amount)', 'total')
      .getRawOne();

    const totalAmount = paymentOrganizationSummaryRepository.total;

    return totalAmount;
  }

  async getTeamSupports(
    organization_id: number,
    query: GetTeamSupportRequest,
  ): Promise<{ paymentTeamSummaries: PaymentTeamSummary[]; total: number }> {
    const conditionQuery = this.createQueryBuilder('payment_team_summaries')
      .leftJoinAndSelect('payment_team_summaries.team', 'team')
      .andWhere('team.organization_id = :organization_id', {
        organization_id: organization_id,
      })
      .andWhere('payment_team_summaries.year = :year', {
        year: query.year,
      });

    if (query.month) {
      conditionQuery.andWhere('payment_team_summaries.month = :month', {
        month: query.month,
      });
    }

    if (query.teams) {
      conditionQuery.andWhere('team.id IN (:...teams)', {
        teams: query.teams,
      });
    }

    const sortType =
      query.sort_type && query.sort_type.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    const sortColumn =
      query.sort_column &&
      [
        'general_support_count',
        'general_support_amount',
        'subscription_support_count',
        'subscription_support_amount',
        'amount',
      ].includes(query.sort_column)
        ? `payment_team_summaries.${query.sort_column}`
        : 'team.name';

    conditionQuery.orderBy(sortColumn, sortType);

    const total = await conditionQuery.getCount();

    const paymentTeamSummaries = await conditionQuery
      .skip(query.offset || 0) // offset default 0
      .take(query.limit || 20) // limit default 20
      .getMany();

    return {
      paymentTeamSummaries: paymentTeamSummaries,
      total: total,
    };
  }
}
