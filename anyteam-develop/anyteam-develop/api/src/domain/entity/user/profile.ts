import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { UserProfile } from 'src/entity/user-profile.entity';

const BASE_THUMB_URL = 'https://resource.anyteam.jp/images/thumbnails/';

export class UserProfileEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @ApiProperty({ example: 1 })
  type: number;

  @ApiProperty({
    example: BASE_THUMB_URL + 'xxxx.jpg',
  })
  thumbnail_url: string;

  @ApiProperty({ example: '運動' })
  firstname: string;

  @ApiProperty({ example: '太郎' })
  lastname: string;

  @ApiProperty({ example: 'ウンドウ' })
  firstname_kana: string;

  @ApiProperty({ example: 'タロウ' })
  lastname_kana: string;

  @ApiProperty({ example: false })
  is_anonymous: boolean;

  @ApiProperty({ example: 1 })
  gender_type: number;

  @ApiProperty({ example: '1988-06-21' })
  birthday: string;

  @ApiProperty({ example: '156-0052' })
  postal_code: string;

  @ApiProperty({ example: 1 })
  region_id: number;

  @ApiProperty({ example: '墨田区大平' })
  municipalities: string;

  @ApiProperty({ example: '4-13-5' })
  address: string;

  @ApiProperty({ example: 'ブリリアタワー604号室' })
  building_name: string;

  @ApiProperty({ example: '福岡大学' })
  university_name: string;

  @ApiProperty({ example: '野球部' })
  university_club: string;

  @ApiProperty({ example: '都城高校' })
  high_school_name: string;

  @ApiProperty({ example: '陸上部' })
  high_school_club: string;

  @ApiProperty({ example: 'ラサール中学校' })
  junior_high_school_name: string;

  @ApiProperty({ example: '野球部' })
  junior_high_school_club: string;

  @ApiProperty({ example: '野球' })
  favorite_competition1: string;

  @ApiProperty({ example: '陸上' })
  favorite_competition2: string;

  @ApiProperty({ example: 'バスケットボール' })
  favorite_competition3: string;

  @ApiProperty({ example: '西武ライオンズ' })
  favorite_team1: string;

  @ApiProperty({ example: 'HONDA' })
  favorite_team2: string;

  @ApiProperty({ example: 'サンフレッチェ広島' })
  favorite_team3: string;

  constructor(
    userEntity: User,
    userProfile: UserProfile,
    userThumbnailUrl: string | null,
  ) {
    this.id = userProfile.id;
    this.email = userEntity.email;
    this.type = userEntity.type;
    this.thumbnail_url = userThumbnailUrl;
    this.firstname = userProfile.firstname;
    this.lastname = userProfile.lastname;
    this.firstname_kana = userProfile.firstname_kana;
    this.lastname_kana = userProfile.lastname_kana;
    this.is_anonymous = userProfile.is_anonymous;
    this.gender_type = userProfile.gender_type_id;
    this.birthday = userProfile.birthday ? userProfile.birthday.toString() : '';
    this.postal_code = userProfile.postal_code;
    this.region_id = userProfile.region_id;
    this.municipalities = userProfile.municipalities;
    this.address = userProfile.address;
    this.building_name = userProfile.building_name;
    this.university_name = userProfile.university_name;
    this.university_club = userProfile.university_club;
    this.high_school_name = userProfile.high_school_name;
    this.high_school_club = userProfile.high_school_club;
    this.junior_high_school_name = userProfile.junior_high_school_name;
    this.junior_high_school_club = userProfile.junior_high_school_club;
    this.favorite_competition1 = userProfile.favorite_competition1;
    this.favorite_competition2 = userProfile.favorite_competition2;
    this.favorite_competition3 = userProfile.favorite_competition3;
    this.favorite_team1 = userProfile.favorite_team1;
    this.favorite_team2 = userProfile.favorite_team2;
    this.favorite_team3 = userProfile.favorite_team3;
  }
}
