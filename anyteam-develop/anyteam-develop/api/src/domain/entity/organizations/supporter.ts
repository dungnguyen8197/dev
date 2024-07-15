import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserThumbnailVo } from 'src/domain/value-object/user/thumbnail';
import { BirthdayVo } from '../../value-object/user/birthday';
import { NameVo } from '../../value-object/user/name';

export class Supporter {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: '遠藤啓太' })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ example: 32 })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  region_id: number;

  @ApiProperty({ example: '北海道' })
  @IsString()
  @IsNotEmpty()
  region_name: string;

  @ApiProperty({ example: ['サッカー部', '野球部', 'テニス部'] })
  @IsArray()
  @IsNotEmpty()
  teams: string[];

  @ApiProperty({ example: 'xxxx.png' })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  constructor(
    user_id: number,
    user_firstname: string,
    user_lastname: string,
    birthday: Date,
    thumbnail: string,
    region_id: number,
    region_name: string,
    teams: string[],
  ) {
    const birthdayVo = new BirthdayVo(birthday);
    const nameVo = new NameVo(user_firstname, user_lastname);
    const thumbnailVo = new UserThumbnailVo(thumbnail);

    this.user_id = user_id;
    this.user_name = nameVo.getFullName();
    this.age = birthdayVo.getAge();
    this.region_id = region_id;
    this.region_name = region_name;
    this.teams = teams;
    this.thumbnail = thumbnailVo.getUrl();
  }
}
