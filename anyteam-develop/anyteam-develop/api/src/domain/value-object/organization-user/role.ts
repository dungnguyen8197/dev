import { ApiProperty } from '@nestjs/swagger';

export const ADMIN = 1;
export const READ_ONLY = 2;
const TYPE = {
  1: {
    label: '管理者',
  },
  2: {
    label: '閲覧者',
  },
};

export class RoleVo {
  @ApiProperty()
  readonly value: number;
  readonly label: string;

  constructor(value: number) {
    if (!TYPE[value]) {
      throw new Error();
    }
    this.value = value;
    this.label = TYPE[this.value].label;
  }

  getValue(): number {
    return this.value;
  }

  getLabel(): string {
    return this.label;
  }
}
