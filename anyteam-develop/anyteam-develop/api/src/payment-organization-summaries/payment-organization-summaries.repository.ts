import { EntityRepository, Repository, getManager } from 'typeorm';
import {
  GetOrganizationSupportRequest,
  GetOrganizationTotalSupportRequest,
} from './../organizations/dto/organization-support.dto';

import { Organization } from 'src/entity/organization.entity';
import { Payment } from 'src/entity/payment.entity';
import { PaymentOrganizationSummary } from './../entity/payment-organization-summary.entity';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { Team } from 'src/entity/team.entity';

@EntityRepository(PaymentOrganizationSummary)
export class PaymentOrganizationSummaryRepository extends Repository<PaymentOrganizationSummary> {
  async findOne(): Promise<PaymentOrganizationSummary> {
    const result = await this.createQueryBuilder(
      'payment_organization_summaries',
    )
      .orderBy('updated_at', 'DESC')
      .getOne();

    return result;
  }

  async getTotalMountPaymentByOrganization(startDate: string, endDate: string) {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .select('organizations.id', 'organization_id')
      .addSelect('payments.amount as payments_amount')
      .addSelect('purchases.type as purchase_type')
      .from(Payment, 'payments')
      .innerJoin(Purchase, 'purchases', 'payments.purchase_id = purchases.id')
      .innerJoin(
        PurchaseTeamAttribute,
        'purchase_team_attributes',
        'purchases.id = purchase_team_attributes.purchase_id',
      )
      .innerJoin(Team, 'teams', 'teams.id = purchase_team_attributes.team_id')
      .innerJoin(
        Organization,
        'organizations',
        'teams.organization_id = organizations.id',
      )
      .where('payments.updated_at BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      });

    const result = await conditionQuery.getRawMany();

    return result;
  }

  async getOrganizationSupportTotal(
    query: GetOrganizationTotalSupportRequest,
  ): Promise<{ organizationCount: number; amount: number }> {
    const conditionQuery = this.createQueryBuilder(
      'payment_organization_summaries',
    );

    conditionQuery.andWhere('payment_organization_summaries.year = :year', {
      year: query.year,
    });

    if (query.month) {
      conditionQuery.andWhere('payment_organization_summaries.month = :month', {
        month: query.month,
      });
    }

    const paymentOrganizationSummaryRepository = await conditionQuery
      .select('SUM(payment_organization_summaries.amount)', 'total')
      .addSelect(
        'COUNT(DISTINCT payment_organization_summaries.organization_id)',
        'organization_count',
      )
      .getRawOne();

    const organizationCount = parseInt(
      paymentOrganizationSummaryRepository.organization_count,
    );

    const totalAmount = parseInt(paymentOrganizationSummaryRepository.total);

    return {
      organizationCount: organizationCount,
      amount: totalAmount,
    };
  }

  async getOrganizationSupports(query: GetOrganizationSupportRequest): Promise<{
    paymentOrganizationSummary: PaymentOrganizationSummary[];
    total: number;
  }> {
    const conditionQuery = this.createQueryBuilder(
      'payment_organization_summaries',
    )
      .leftJoinAndSelect(
        'payment_organization_summaries.organization',
        'organization',
      )
      .leftJoinAndSelect('organization.region', 'region')
      .leftJoinAndSelect('organization.organization_teams', 'teams');

    conditionQuery.andWhere('payment_organization_summaries.year = :year', {
      year: query.year,
    });

    if (query.month) {
      conditionQuery.andWhere('payment_organization_summaries.month = :month', {
        month: query.month,
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
        ? `payment_organization_summaries.${query.sort_column}`
        : 'organization.name_kana';

    conditionQuery.orderBy(sortColumn, sortType);

    const total = await conditionQuery.getCount();

    const paymentOrganizationSummaryRepository = await conditionQuery
      .skip(query.offset || 0) // offset default 0
      .take(query.limit || 20) // limit default 20
      .getMany();

    return {
      paymentOrganizationSummary: paymentOrganizationSummaryRepository,
      total: total,
    };
  }
}
