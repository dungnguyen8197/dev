import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  IsNumber,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';

export class AdminOrganizationDTO {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  region_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  division_type_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  name_line_id: number;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  is_group: boolean;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsIn([0, 1])
  status: number;

  @ApiProperty({ example: '運動通信大学' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '目黒区' })
  @IsOptional()
  @IsString()
  municipalities: string;

  @ApiProperty({ example: '駒場1-1-1' })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ example: '風間ビル4階' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  building_name: string;

  @ApiProperty({ example: '1234-5678-910' })
  @IsOptional()
  @Matches(/\d{4}-\d{4}-\d{3}/)
  @MaxLength(13)
  telephone_number: string;

  @ApiProperty({ example: '1234' })
  @IsOptional()
  @Matches(/^\d{4}$/)
  bank_code: string;

  @ApiProperty({ example: '123' })
  @IsOptional()
  @Matches(/^\d{3}$/)
  branch_code: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsIn([1, 2, 3])
  account_type_id: number;

  @ApiProperty({ example: '1234567' })
  @IsOptional()
  @Matches(/^\d{7}$/)
  account_number: string;

  @ApiProperty({ example: 'エンドウケイタ' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  account_holder: string;

  @ApiProperty({ example: 'test.png' })
  @IsOptional()
  icon: string;
}

export class AdminGetOrganizationsQuery {
  @ApiProperty({ example: '運動通信大学', required: false })
  name: string;

  @ApiProperty({ example: 10, required: false })
  limit: number;

  @ApiProperty({ example: 0, required: false })
  offset: number;
}
