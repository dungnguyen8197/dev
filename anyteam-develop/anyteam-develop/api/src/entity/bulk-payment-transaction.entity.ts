import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'bulk_payment_transactions' })
export class BulkPaymentTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Index('year-month-idx')
  @Column('varchar', { length: 6, comment: 'YYYYMM' })
  @ApiProperty({ example: '202203' })
  year_month: string;

  @Column('int2', {
    default: 1,
    comment: '1: uploading, 2: uploaded, 3: downloading, 4: complete',
  })
  @ApiProperty({ example: 1 })
  stage: number;

  @Column('text', {
    nullable: true,
    comment: '"batm" + {ShopID} + {YYYYMMDD} + {serial number}',
  })
  @ApiProperty({ example: 'batmtshop0005429720220323001' })
  filename: string;
}
