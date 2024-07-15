import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Payment } from './payment.entity';

/**
 * 会員決済情報
 */
@Entity({ name: 'wallets' })
export class Wallet extends BaseEntity {
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
  @ApiProperty({ example: 1 })
  user_id: number;

  @Column('int2', { comment: '1: card payment' })
  @ApiProperty({ example: 1 })
  payment_method: number;

  @Column('varchar', {
    length: 16,
    nullable: true,
    comment: 'masked credit card number',
  })
  @ApiProperty({ example: '411*************' })
  card_no: string;

  @Column('varchar', {
    length: 4,
    nullable: true,
    comment: 'expiration year of card',
  })
  @ApiProperty({ example: '2021' })
  expiration_year: string;

  @Column('varchar', {
    length: 2,
    nullable: true,
    comment: 'expiration month of card',
  })
  @ApiProperty({ example: '06' })
  expiration_month: string;

  @Column('boolean', { default: false })
  @ApiProperty({ example: true })
  enabled: boolean;

  @OneToOne(() => User)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user: User;

  @OneToMany(() => Payment, (payments) => payments.wallet, {
    nullable: true,
  })
  payments: Payment[];
}
