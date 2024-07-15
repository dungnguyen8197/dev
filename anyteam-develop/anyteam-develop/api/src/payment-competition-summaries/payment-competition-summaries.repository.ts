import { EntityRepository, Repository, getManager } from 'typeorm';

import { Competition } from 'src/entity/competition.entity';
import { Payment } from 'src/entity/payment.entity';
import { PaymentCompetitionSummary } from 'src/entity/payment-competition-summary.entity';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { Team } from 'src/entity/team.entity';

@EntityRepository(PaymentCompetitionSummary)
export class PaymentCompetitionSummariesRepository extends Repository<PaymentCompetitionSummary> {
  async findOne(): Promise<PaymentCompetitionSummary> {
    const result = await this.createQueryBuilder(
      'payment_competition_summaries',
    )
      .orderBy('updated_at', 'DESC')
      .getOne();

    return result;
  }

  async getTotalMountPaymentByCompetition(
    startDate: string,
    endDate: string,
  ): Promise<PaymentCompetitionSummary[]> {
    const conditionQuery = await getManager()
      .createQueryBuilder()
      .select('competitions.id', 'competition_id')
      .addSelect('SUM(payments.amount)', 'total_amount')
      .from(Payment, 'payments')
      .innerJoin(Purchase, 'purchases', 'payments.purchase_id = purchases.id')
      .innerJoin(
        PurchaseTeamAttribute,
        'purchase_team_attributes',
        'purchases.id = purchase_team_attributes.purchase_id',
      )
      .innerJoin(Team, 'teams', 'teams.id = purchase_team_attributes.team_id')
      .innerJoin(
        Competition,
        'competitions',
        'competitions.id = teams.competition_id',
      )
      .where('payments.updated_at BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      })
      .addGroupBy('competitions.id');

    const result = await conditionQuery.getRawMany();

    return result;
  }
}
