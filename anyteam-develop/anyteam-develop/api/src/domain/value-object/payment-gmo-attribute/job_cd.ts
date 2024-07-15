import { ApiProperty } from '@nestjs/swagger';

export const CHECK = 'CHECK';
export const CAPTURE = 'CAPTURE';

export class PaymentGmoAttributeJobCdVo {
  @ApiProperty()
  readonly value: string;

  constructor(value: string) {
    if (value !== CHECK && value !== CAPTURE) {
      throw new Error();
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
