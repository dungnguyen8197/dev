import { ApiProperty } from '@nestjs/swagger';

export const ORGANIZATION_STATUS_DEACTIVE = 0;
export const ORGANIZATION_STATUS_ACTIVE = 1;

export class OrganizationStatusVo {
  @ApiProperty()
  readonly value: number;

  constructor(value: number) {
    const statusList = [
      ORGANIZATION_STATUS_DEACTIVE,
      ORGANIZATION_STATUS_ACTIVE,
    ];
    if (!statusList.includes(value)) {
      throw new Error();
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
