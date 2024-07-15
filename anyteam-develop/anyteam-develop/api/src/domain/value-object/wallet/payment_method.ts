import { ApiProperty } from '@nestjs/swagger';

export const CARD = 1;

export class WalletPaymentMethodVo {
  @ApiProperty()
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
