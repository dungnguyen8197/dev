import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UserProfileRequest {
  @ApiProperty({ example: 'xxxx.png' })
  @IsOptional()
  @IsString()
  thumbnail: string;

  @ApiProperty({ example: '運動' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: '太郎' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'ウンドウ' })
  @IsNotEmpty()
  @IsString()
  firstname_kana: string;

  @ApiProperty({ example: 'タロウ' })
  @IsNotEmpty()
  @IsString()
  lastname_kana: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  is_anonymous: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  gender_type_id: number;

  @ApiProperty({ example: '1988-06-21' })
  @IsOptional()
  @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/)
  birthday: string;

  @ApiProperty({ example: '156-0052' })
  @Matches(/\d{3}-\d{4}/)
  postal_code: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  region_id: number;

  @ApiProperty({ example: '墨田区大平' })
  @IsString()
  municipalities: string;

  @ApiProperty({ example: '1-1-1' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'ブリリアタワー604号室' })
  @IsOptional()
  @IsString()
  building_name: string;

  @ApiProperty({ example: '福岡大学' })
  @IsOptional()
  @IsString()
  university_name: string;

  @ApiProperty({ example: '野球部' })
  @IsOptional()
  @IsString()
  university_club: string;

  @ApiProperty({ example: '都城高校' })
  @IsOptional()
  @IsString()
  high_school_name: string;

  @ApiProperty({ example: '陸上部' })
  @IsOptional()
  @IsString()
  high_school_club: string;

  @ApiProperty({ example: 'ラサール中学校' })
  @IsOptional()
  @IsString()
  junior_high_school_name: string;

  @ApiProperty({ example: '野球部' })
  @IsOptional()
  @IsString()
  junior_high_school_club: string;

  @ApiProperty({ example: '野球' })
  @IsOptional()
  @IsString()
  favorite_competition1: string;

  @ApiProperty({ example: '陸上' })
  @IsOptional()
  @IsString()
  favorite_competition2: string;

  @ApiProperty({ example: 'バスケットボール' })
  @IsOptional()
  @IsString()
  favorite_competition3: string;

  @ApiProperty({ example: '西武ライオンズ' })
  @IsOptional()
  @IsString()
  favorite_team1: string;

  @ApiProperty({ example: 'HONDA' })
  @IsOptional()
  @IsString()
  favorite_team2: string;

  @ApiProperty({ example: 'サンフレッチェ広島' })
  @IsOptional()
  @IsString()
  favorite_team3: string;
}
