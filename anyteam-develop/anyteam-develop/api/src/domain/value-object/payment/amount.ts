import { ApiProperty } from '@nestjs/swagger';

export class PaymentAmountVo {
  @ApiProperty()
  readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error();
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
