import { ApiProperty } from '@nestjs/swagger';
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
import { User } from './user.entity';
import { IsNotEmpty } from 'class-validator';

/**
 * 法人会員プロフィール管理
 */
@Entity({ name: 'corporate_profiles' })
export class CorporateProfile extends BaseEntity {
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
  @ApiProperty({ example: 2 })
  user_id: number;

  @Column('varchar', { length: 50 })
  @ApiProperty({ example: '株式会社運動通信社' })
  name: string;

  @Column('varchar', { length: 50 })
  @ApiProperty({ example: 'カブシキガイシャウンドウツウシンシャ' })
  name_kana: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '代表取締役' })
  representative_position: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '太郎' })
  representative_firstname: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '山田' })
  representative_lastname: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: 'タロウ' })
  representative_firstname_kana: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: 'ヤマダ' })
  representative_lastname_kana: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '営業部' })
  staff_department: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '啓太' })
  staff_firstname: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: '遠藤' })
  staff_lastname: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: 'ケイタ' })
  staff_firstname_kana: string;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({ example: 'エンドウ' })
  staff_lastname_kana: string;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'img2021022411242795793500.png' })
  thumbnail: string;

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
  @ApiProperty({ example: 'カザマビル4階' })
  building_name: string;

  @Column('varchar', { length: 13, nullable: true })
  @ApiProperty({ example: '03-6435-0000' })
  telephone_number: string;

  @OneToOne(() => User)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user: User;
}
