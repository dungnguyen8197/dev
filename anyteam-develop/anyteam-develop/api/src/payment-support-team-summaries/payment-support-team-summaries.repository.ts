import { EntityRepository, Repository, getManager } from 'typeorm';

import { Payment } from 'src/entity/payment.entity';
import { PaymentSupportTeamSummary } from 'src/entity/payment-support-team-summary.entity';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { Team } from 'src/entity/team.entity';
import { User } from 'src/entity/user.entity';
import { Wallet } from 'src/entity/wallet.entity';

@EntityRepository(PaymentSupportTeamSummary)
export class PaymentSupportTeamSummariesRepository extends Repository<PaymentSupportTeamSummary> {
  async findOne(): Promise<PaymentSupportTeamSummary> {
    const result = await this.createQueryBuilder(
      'payment_support_team_summaries',
    )
      .orderBy('updated_at', 'DESC')
      .getOne();

    return result;
  }

  async getTotalMountPaymentBySupportTeam(
    startDate: string,
    endDate: string,
  ): Promise<PaymentSupportTeamSummary[]> {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .select('users.id', 'user_id')
      .addSelect('teams.id', 'team_id')
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
      .where('payments.updated_at BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      })
      .groupBy('users.id')
      .addGroupBy('teams.id');

    const result = await conditionQuery.getRawMany();

    return result;
  }
}
