import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetOrganizationInfoResponse {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

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

  @ApiProperty({ example: '運動通信大学' })
  @IsNotEmpty()
  @IsString()
  name: string;

  constructor(
    id: number,
    region_id: number,
    region_name: string,
    division_type_id: number,
    division_type_name: string,
    name: string,
  ) {
    this.id = id;
    this.region_id = region_id;
    this.region_name = region_name;
    this.division_type_id = division_type_id;
    this.division_type_name = division_type_name;
    this.name = name;
  }
}
