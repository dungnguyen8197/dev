import { ApiProperty } from '@nestjs/swagger';

const PREFIX = 'at-';

export class PaymentGmoAttributeOrderIdVo {
  @ApiProperty()
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
