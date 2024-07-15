import { ApiProperty } from '@nestjs/swagger';

export const INDIVIDUAL = 1;
export const CORPORATE = 2;

const TYPE = [
  { id: INDIVIDUAL, label: '個人' },
  { id: CORPORATE, label: '法人' },
];

export class UserTypeVo {
  @ApiProperty()
  readonly value: number;
  readonly label: string;

  constructor(value: number) {
    if (!TYPE.some((obj) => obj.id === value)) {
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
