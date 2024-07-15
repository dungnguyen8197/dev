import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.entity';

/**
 * 会員プロフィール管理
 */
@Entity({ name: 'user_profiles' })
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'user.id' })
  @ApiProperty({ example: 10 })
  user_id: number;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'taro' })
  firstname: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'yamada' })
  lastname: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'taro' })
  firstname_kana: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'yamada' })
  lastname_kana: string;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'img2021022411242795793500.png' })
  thumbnail: string;

  @Column('boolean', { default: false })
  @ApiProperty({ example: false })
  is_anonymous: boolean;

  @Column('int4', { nullable: true })
  @ApiProperty({ example: 1 })
  gender_type_id: number;

  @Column('date', { nullable: true })
  @ApiProperty({ example: '1991-05-16 00:00:00' })
  birthday: Date;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '123-4567' })
  postal_code: string;

  @Column('int4', { comment: 'regions.id', nullable: true })
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  region_id: number;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '目黒区' })
  municipalities: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '駒場1-1-1' })
  address: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '風間ビル4階' })
  building_name: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: '運動大学' })
  university_name: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: '野球部' })
  university_club: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: '運動高校' })
  high_school_name: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'アメリカンフットボール部' })
  high_school_club: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: '高校' })
  junior_high_school_name: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'アメリカンフットボール部' })
  junior_high_school_club: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'サッカー' })
  favorite_competition1: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: '野球' })
  favorite_competition2: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'バスケットボール' })
  favorite_competition3: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'サッカー部' })
  favorite_team1: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: '野球部' })
  favorite_team2: string;

  @Column('varchar', { nullable: true, length: 50 })
  @ApiProperty({ example: 'バスケットボール部' })
  favorite_team3: string;

  @OneToOne(() => User)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user: User;
}
