import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TEAM_STATUS_ACTIVE, TEAM_STATUS_DEACTIVE } from 'src/domain/value-object/team/status';

export class OrganizationTeamUpdateRequest {
  @ApiProperty({ example: 1})
  @IsNumber()
  id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  competition_id: number;

  @ApiProperty({ example: 'anyteam' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1, enum: [TEAM_STATUS_DEACTIVE, TEAM_STATUS_ACTIVE] })
  @IsNotEmpty()
  @IsNumber()
  status: number;
}