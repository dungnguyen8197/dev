import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 金融機関コードマスタ
 * 提供マスタの定義に則る cf. https://www.jba-shuppancenter.jp/content/cd/tenpoCD2.html
 */
@Entity({ name: 'financial_institutions' })
export class FinancialInstitution extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @Column('varchar', { length: 4, comment: 'Financial institution code' })
  @ApiProperty({ example: '0001' })
  code: string;

  @Column('varchar', { length: 3, comment: 'Financial institution shop code' })
  @ApiProperty({ example: '179' })
  shop_code: string;

  @Column('varchar', { length: 255, comment: 'Financial institution name' })
  @ApiProperty({ example: '運動通信銀行' })
  name: string;

  @Column('varchar', {
    length: 255,
    comment: 'Financial institution name kana',
  })
  @ApiProperty({ example: 'ウンドウツウシンギンコウ' })
  name_kana: string;

  @Column('varchar', {
    length: 255,
    comment: 'Financial institution shop name',
  })
  @ApiProperty({ example: '西新橋支店' })
  shop_name: string;

  @Column('varchar', {
    length: 255,
    comment: 'Financial institution shop name kana',
  })
  @ApiProperty({ example: 'ニシシンバシシテン' })
  shop_name_kana: string;

  @Column('varchar', { length: 8 })
  @ApiProperty({ example: '123-4567' })
  postal_code: string;

  @Column('text')
  @ApiProperty({ example: '東京都港区西新橋1-2-3' })
  location: string;

  @Column('varchar', { length: 17 })
  @ApiProperty({ example: '0986-12-3456' })
  telephone_number: string;

  @Column('varchar', { length: 4 })
  @ApiProperty({ example: '1234' })
  bill_exchange_number: string;

  @Column('int2', { comment: '0 or 1' })
  @ApiProperty({ example: '1' })
  sort_code: number;
}
