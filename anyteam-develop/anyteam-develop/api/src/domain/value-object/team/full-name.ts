import { ApiProperty } from '@nestjs/swagger';

export class TeamFullNameVo {
  @ApiProperty()
  readonly org_name: string;
  readonly team_name: string;

  constructor(org_name: string, team_name: string) {
    this.org_name = org_name;
    this.team_name = team_name;
  }

  getFullName(): string {
    return this.org_name + this.team_name;
  }
}
