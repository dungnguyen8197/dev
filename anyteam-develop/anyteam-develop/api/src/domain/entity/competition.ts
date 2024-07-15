import * as moment from 'moment';

import { ApiProperty } from '@nestjs/swagger';

export class CompetitionEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Competition 1' })
  name: string;
  created_at: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class AdminGetCompetitionEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Competition 1' })
  name: string;

  @ApiProperty({ example: '2021-12-01 13:00:00' })
  created_at: Date | string;

  constructor(id: number, name: string, created_at: Date | string) {
    this.id = id;
    this.name = name;
    this.created_at = moment(created_at).format('YYYY-MM-DD HH:mm:ss');
  }
}
