import { ApiProperty } from '@nestjs/swagger';
import { TeamEntity } from '../team';

export class TeamList {
  @ApiProperty({ example: 20})
  count: number;

  @ApiProperty({ example: 10 })
  offset: number;
  
  @ApiProperty({ type: [TeamEntity] })
  list: TeamEntity[];

  constructor(list: TeamEntity[], count: number, offset: number) {
    this.list = list;
    this.count = count;
    this.offset = offset;
  }
}
