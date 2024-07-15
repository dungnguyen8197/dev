import { ApiProperty } from '@nestjs/swagger';

const TRANSACTION_FEE_RATE = 0.15;
const RECEIVED_AMOUNT_RATE = 0.75;

export class AmountVo {
  @ApiProperty()
  readonly value: number;
  readonly transaction_fee: number;
  readonly received_amount: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error();
    }
    this.value = value;
    this.transaction_fee = this.calculateTransactionFee(value);
    this.received_amount = this.calculateReceivedAmount(value);
  }

  getValue(): number {
    return this.value;
  }

  getTransactionFee(): number {
    return this.transaction_fee;
  }

  getReceivedAmount(): number {
    return this.received_amount;
  }

  private calculateTransactionFee(amount: number) {
    return Math.floor(amount * TRANSACTION_FEE_RATE);
  }

  private calculateReceivedAmount(amount: number) {
    return Math.floor(amount * RECEIVED_AMOUNT_RATE);
  }
}
