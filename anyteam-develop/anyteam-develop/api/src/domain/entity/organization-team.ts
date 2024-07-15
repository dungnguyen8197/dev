import { ApiProperty } from '@nestjs/swagger';
import { Competition } from 'src/entity/competition.entity';
import { TeamStatusVo } from '../value-object/team/status';

export class OrganizationTeamEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  status: number;

  @ApiProperty({ example: '運動大学アイスホッケー部' })
  name: string;

  @ApiProperty({ example: 1 })
  competition_id: number;

  constructor(id: number, status: number, name: string, competition_id: number) {
    const statusVo = new TeamStatusVo(status);

    this.id = id;
    this.status = statusVo.getValue();
    this.name = name;
    this.competition_id = competition_id;
  }
}