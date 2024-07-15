import { EntityRepository, Repository, getManager } from 'typeorm';

import { Organization } from 'src/entity/organization.entity';
import { Payment } from 'src/entity/payment.entity';
import { PaymentSupportOrganizationSummary } from 'src/entity/payment-support-organization-summary.entity';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { Team } from 'src/entity/team.entity';
import { User } from 'src/entity/user.entity';
import { Wallet } from 'src/entity/wallet.entity';

@EntityRepository(PaymentSupportOrganizationSummary)
export class PaymentSupportOrganizationSummariesRepository extends Repository<PaymentSupportOrganizationSummary> {
  async findOne(): Promise<PaymentSupportOrganizationSummary> {
    const result = await this.createQueryBuilder(
      'payment_support_organization_summaries',
    )
      .orderBy('updated_at', 'DESC')
      .getOne();

    return result;
  }

  async getTotalMountPaymentBySupportOrganization(
    startDate: string,
    endDate: string,
  ) {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .select('users.id', 'user_id')
      .addSelect('organizations.id', 'organization_id')
      .addSelect('SUM(payments.amount)', 'total_amount')
      .from(Payment, 'payments')
      .innerJoin(Wallet, 'wallets', 'payments.wallet_id = wallets.id')
      .innerJoin(User, 'users', 'wallets.user_id = users.id')
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
      })
      .groupBy('users.id')
      .addGroupBy('organizations.id');

    const result = await conditionQuery.getRawMany();

    return result;
  }
}
