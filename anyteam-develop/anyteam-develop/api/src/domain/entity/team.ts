import { ApiProperty } from '@nestjs/swagger';
import { TeamStatusVo } from '../value-object/team/status';

export class TeamEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  status: number;

  @ApiProperty({ example: 'アイスホッケー部' })
  name: string;

  constructor(id: number, status: number, name: string) {
    const statusVo = new TeamStatusVo(status);

    this.id = id;
    this.status = statusVo.getValue();
    this.name = name;
  }
}
