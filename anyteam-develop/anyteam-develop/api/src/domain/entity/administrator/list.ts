import { ApiProperty } from '@nestjs/swagger';
import { AdministratorEntity } from '../administrator';

export class AdministratorList {
  @ApiProperty({ example: 20})
  count: number;

  @ApiProperty({ example: 10 })
  offset: number;
  
  @ApiProperty({ type: [AdministratorEntity] })
  list: AdministratorEntity[];

  constructor(list: AdministratorEntity[], count: number, offset: number) {
    this.list = list;
    this.count = count;
    this.offset = offset;
  }
}
