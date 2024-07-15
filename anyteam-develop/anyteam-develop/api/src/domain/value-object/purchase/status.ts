import { ApiProperty } from '@nestjs/swagger';

export const INVALID = 0;
export const VALID = 1;

export class PurchaseStatusVo {
  @ApiProperty()
  readonly value: number;

  constructor(value: number) {
    const statusList = [INVALID, VALID];
    if (!statusList.includes(value)) {
      throw new Error();
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
