import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Team } from 'src/entity/team.entity';
import { TeamStatusVo } from 'src/domain/value-object/team/status';

export class FindTeamByNameRequest {
  @ApiProperty({ example: 'TEST' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FindTeamByNameResponse {
  constructor(teamProfile: Team[]) {
    this.list = teamProfile;
  }

  @ApiProperty()
  list: Team[];
}

export class FindTeamByIdResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  status: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  region_id: number;

  @ApiProperty({ example: '北海道' })
  @IsNotEmpty()
  @IsString()
  region_name: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  division_type_id: number;

  @ApiProperty({ example: '高校' })
  @IsNotEmpty()
  @IsString()
  division_type_name: string;

  @ApiProperty({ example: 'アイスホッケー部' })
  name: string;

  @ApiProperty({ example: 1 })
  organization_id: number;

  @ApiProperty({ example: '運動大学' })
  organization_name: string;

  @ApiProperty({ example: 1 })
  competition_id: number;

  @ApiProperty({ example: '野球' })
  competition_name: string;

  @ApiProperty({ example: 1000 })
  supporter_count: number;

  constructor(team: Team) {
    const teamStatusVo = new TeamStatusVo(team.status);
    const organization = team.organization;
    const competition = team.competition;
    const region = team.organization.region;
    const organization_division_type =
      team.organization.organization_division_type;

    this.id = team.id;
    this.status = teamStatusVo.getValue();
    this.region_id = region.id;
    this.region_name = region.name;
    this.division_type_id = organization_division_type.id;
    this.division_type_name = organization_division_type.name;
    this.name = team.name;
    this.organization_id = organization.id;
    this.organization_name = organization.name;
    this.competition_id = competition.id;
    this.competition_name = competition.name;
    this.supporter_count = 1000; // TODO: 支援サマリTBL実装後に修正
  }
}
