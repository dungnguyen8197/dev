export interface UserProfileRO {
  id: number;
  thumbnail_url: string;
  firstname: string;
  lastname: string;
  firstname_kana: string;
  lastname_kana: string;
  is_anonymous: boolean;
  gender_type: number;
  birthday: string;
  postal_code: string;
  region_id: number;
  municipalities: string;
  address: string;
  building_name: string;
  university_name: string;
  university_club: string;
  high_school_name: string;
  high_school_club: string;
  junior_high_school_name: string;
  junior_high_school_club: string;
  favorite_competition1: string;
  favorite_competition2: string;
  favorite_competition3: string;
  favorite_team1: string;
  favorite_team2: string;
  favorite_team3: string;
}

export interface UserProfileRequest {
  thumbnail?: string;
  firstname: string;
  lastname: string;
  firstname_kana: string;
  lastname_kana: string;
  is_anonymous: boolean;
  birthday: string;
  gender_type_id: number;
  postal_code: string;
  region_id: number;
  address: string;
  municipalities: string;
  building_name: string;
  university_name: string;
  university_club: string;
  high_school_name: string;
  high_school_club: string;
  junior_high_school_name: string;
  junior_high_school_club: string;
  favorite_competition1: string;
  favorite_competition2: string;
  favorite_competition3: string;
  favorite_team1: string;
  favorite_team2: string;
  favorite_team3: string;
}

export interface ProfileErrorMessage {
  firstname: string;
  lastname: string;
  firstname_kana: string;
  lastname_kana: string;
  postal_code: string;
  region_id: string;
  address: string;
  municipalities: string;
  building_name: string;
  birthday: string;
  gender_type: string;
  common: string;
}