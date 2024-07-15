import { ApiProperty } from '@nestjs/swagger';

export const PROMPT = 1;
export const SUBSCRIPTION = 2;

const TYPE = [
  { id: PROMPT, label: '通常' },
  { id: SUBSCRIPTION, label: '定期' },
];

export class PurchaseTypeVo {
  @ApiProperty()
  readonly value: number;
  readonly label: string;

  constructor(value: number) {
    const types = [PROMPT, SUBSCRIPTION];
    if (!types.includes(value)) {
      throw new Error();
    }
    this.value = value;
    this.label = TYPE.find((obj) => obj.id === value).label;
  }

  getValue(): number {
    return this.value;
  }

  getLabel(): string {
    return this.label;
  }
}
