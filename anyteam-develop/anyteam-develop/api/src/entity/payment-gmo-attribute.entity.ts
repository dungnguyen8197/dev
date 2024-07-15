import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Payment } from './payment.entity';

/**
 * 決済履歴詳細情報（GMO属性）
 */
@Entity({ name: 'payment_gmo_attributes' })
@Unique(['order_id'])
export class PaymentGmoAttribute extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'payment.id' })
  @ApiProperty({ example: 1 })
  payment_id: number;

  @Column('varchar', {
    length: 27,
    comment: '`at-` + timestamp which contained micro seconds',
  })
  @ApiProperty({ example: 'at-1234567890123456' })
  order_id: string;

  @Column('varchar', { length: 7, comment: 'CHECK or CAPTURE' })
  @ApiProperty({ example: 'CAPTURE' })
  job_cd: string;

  @Column('boolean')
  @ApiProperty({ example: true })
  is_success: boolean;

  @Column('int2', { default: 0, comment: 'Fixed value' })
  @ApiProperty({ example: 0 })
  method: number;

  @Column('varchar', {
    length: 32,
    nullable: true,
    comment: 'Access ID from GMO via EntryTran API',
  })
  @ApiProperty({ example: '77a5b328a65b841e91efa83848bf1e49' })
  access_id: string;

  @Column('varchar', {
    length: 32,
    nullable: true,
    comment: 'Access Pass from GMO via EntryTran API',
  })
  @ApiProperty({ example: '3497baaa54c6f84925d4d447286a8809' })
  access_pass: string;

  @Column('varchar', {
    length: 7,
    nullable: true,
    comment: 'Access code from GMO via ExecTran API',
  })
  @ApiProperty({ example: '0000000' })
  approve: string;

  @Column('varchar', {
    length: 28,
    nullable: true,
    comment: 'Transaction ID from GMO via ExecTran API',
  })
  @ApiProperty({ example: '' })
  tran_id: string;

  @Column('varchar', {
    length: 14,
    nullable: true,
    comment: 'Transaction date from GMO via ExecTran API',
  })
  @ApiProperty({ example: '20210201101010' })
  tran_date: string;

  @Column('varchar', {
    length: 7,
    nullable: true,
    comment: 'Destination card company from GMO via SaveCard API',
  })
  @ApiProperty({ example: '2a99662' })
  forward: string;

  @Column('json', {
    nullable: true,
    comment: 'Error info in GMO transaction',
  })
  @ApiProperty({ example: '{"ErrCode":"E01","ErrInfo":"E01240002"}' })
  error_info: JSON;

  @OneToOne(() => Payment)
  @JoinColumn([
    {
      name: 'payment_id',
      referencedColumnName: 'id',
    },
  ])
  payment: Payment;
}
