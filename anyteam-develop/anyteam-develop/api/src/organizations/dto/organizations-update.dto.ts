import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class OrganizationUpdateRequest {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsString()
  region_id: number;

  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123-4567' })
  @IsNotEmpty()
  @IsString()
  postal_code: string;

  @ApiProperty({ example: 'Osakashi' })
  @IsNotEmpty()
  @IsString()
  municipalities: string;

  @ApiProperty({ example: 'Osaka' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Umeda Sky Building' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  building_name: string;

  @ApiProperty({ example: '1234-5678-910' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  telephone_number: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @Length(4)
  bank_code: string;

  @ApiProperty({ example: '456' })
  @IsNotEmpty()
  @IsString()
  @Length(3)
  branch_code: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsString()
  account_type_id: number;

  @ApiProperty({ example: '0123456' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  account_number: string;

  @ApiProperty({ example: 'エンドウケイタ' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  account_holder: string;
}
