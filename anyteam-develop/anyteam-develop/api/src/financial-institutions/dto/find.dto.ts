import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class FindFinancialInstitutionRequest {
  @ApiProperty({ example: '1234', required: true })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: '567', required: false })
  shop_code: string;
}

export class FindFinancialInstitutionResponse {
  @ApiProperty({ example: '運動通信銀行' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'ウンドウツウシンギンコウ' })
  @IsNotEmpty()
  @IsString()
  name_kana: string;

  @ApiProperty({ example: '西新橋支店', required: false })
  @IsOptional()
  @IsString()
  shop_name: string;

  @ApiProperty({ example: 'ニシシンバシシテン', required: false })
  @IsOptional()
  @IsString()
  shop_name_kana: string;

  constructor(
    name: string,
    name_kana: string,
    shop_name?: string,
    shop_name_kana?: string,
  ) {
    this.name = name;
    this.name_kana = name_kana;
    this.shop_name = shop_name;
    this.shop_name_kana = shop_name_kana;
  }
}
