import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetOrganizationSupportersRequest {
  @ApiProperty({ example: 2022 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  year: number;

  @ApiProperty({ required: false, example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month: number;

  @ApiProperty({
    required: false,
    example: 'pref',
    default: 'name',
    description: 'name | age',
  })
  @IsString()
  @IsOptional()
  sort_column: string;

  @ApiProperty({
    required: false,
    example: 'desc',
    default: 'asc',
    description: 'asc | desc',
  })
  @IsString()
  @IsOptional()
  sort_type: string;

  @ApiProperty({ required: false, default: 20 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset: number;

  @ApiProperty({
    required: false,
    example: [1, 13, 40],
    description: 'default all regions',
  })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  regions: number[];

  @ApiProperty({
    required: false,
    example: [1, 2, 3],
    description: 'default all teams',
  })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  teams: number[];
}
