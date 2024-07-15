import { ApiProperty } from '@nestjs/swagger';
import { OrganizationTeamEntity } from '../organization-team';
import { TeamEntity } from '../team';

export class OrganizationTeamList {
  @ApiProperty({ example: 10 })
  offset: number;
  
  @ApiProperty({ type: [OrganizationTeamEntity] })
  list: OrganizationTeamEntity[];

  constructor(list: OrganizationTeamEntity[]) {
    this.list = list;
  }
}
