import { ApiProperty } from '@nestjs/swagger';
// import { exception } from 'console';

export const TEAM_STATUS_DEACTIVE = 0;
export const TEAM_STATUS_ACTIVE = 1;

export class TeamStatusVo {
  @ApiProperty()
  readonly value: number;

  constructor(value: number) {
    const statusList = [TEAM_STATUS_DEACTIVE, TEAM_STATUS_ACTIVE];
    if (!statusList.includes(value)) {
      throw new Error();
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
