import { ApiProperty } from '@nestjs/swagger';
import { AdminOrganizationEntity } from './entity';

export class AdminOrganizationList {
  @ApiProperty({ type: [AdminOrganizationEntity] })
  list: AdminOrganizationEntity[];

  @ApiProperty({ type: Number })
  total: number;

  constructor(list: AdminOrganizationEntity[], total: number) {
    this.list = list;
    this.total = total;
  }
}
