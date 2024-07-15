import {
  AdminGetCompetitionEntity,
  CompetitionEntity,
} from 'src/domain/entity/competition';

import { ApiProperty } from '@nestjs/swagger';

export class CompetitionsList {
  @ApiProperty({ type: [CompetitionEntity] })
  list: CompetitionEntity[];

  constructor(list: CompetitionEntity[]) {
    this.list = list;
  }
}

export class AdminGetCompetitionsList {
  @ApiProperty({ example: 20 })
  count: number;

  @ApiProperty({ example: 10 })
  offset: number;

  @ApiProperty({ type: [AdminGetCompetitionEntity] })
  list: AdminGetCompetitionEntity[];

  constructor(
    list: AdminGetCompetitionEntity[],
    count: number,
    offset: number,
  ) {
    this.list = list;
    this.count = count;
    this.offset = Number(offset);
  }
}

export class AdminGetListRequest {
  @ApiProperty({ default: 'string', required: false })
  search: string;

  @ApiProperty({ default: 10, required: false })
  limit: number;

  @ApiProperty({ default: 0, required: false })
  offset: number;
}
