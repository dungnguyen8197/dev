import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TeamEntity } from '../../domain/entity/team';

export class TeamRegisterRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  competition_id: number;
}

export class TeamRegisterResponse {
  @ApiProperty({ type: TeamEntity })
  readonly team: TeamEntity;

  constructor(teamEntity: TeamEntity) {
    this.team = teamEntity;
  }
}