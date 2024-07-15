import * as moment from 'moment';

import { PaymentAmountVo } from '../../value-object/payment/amount';
import {
  PROMPT,
  SUBSCRIPTION,
  PurchaseTypeVo,
} from '../../value-object/purchase/type';

export class PaymentItemEntity {
  payment_date: string;
  amount: number;
  type: number;
  user_id: number;
  team_id: number;

  constructor(
    created_at: Date,
    amount: number,
    type: number,
    user_id: number,
    team_id: number,
  ) {
    const amountVo = new PaymentAmountVo(amount);
    const typeVo = new PurchaseTypeVo(type);

    this.payment_date = this.formatDate(created_at);
    this.amount = amountVo.getValue();
    this.type = typeVo.getValue();
    this.user_id = user_id;
    this.team_id = team_id;
  }

  getGeneralSupportDate(): string | null {
    return this.type === PROMPT ? this.payment_date : null;
  }

  getGeneralSupportAmount(): number | null {
    return this.type === PROMPT ? this.amount : null;
  }

  getSubscriptionSupportDate(): string | null {
    return this.type === SUBSCRIPTION ? this.payment_date : null;
  }

  getSubscriptionSupportAmount(): number | null {
    return this.type === SUBSCRIPTION ? this.amount : null;
  }

  getPaymentDate(): string {
    return this.payment_date;
  }

  getAmount(): number {
    return this.amount;
  }

  getType(): number {
    return this.type;
  }

  getTeamId(): number {
    return this.team_id;
  }

  private formatDate(date: Date): string {
    return moment(date).format('YYYY/MM/DD');
  }
}
