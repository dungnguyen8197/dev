import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Purchase } from './purchase.entity';
import { PaymentGmoAttribute } from './payment-gmo-attribute.entity';

/**
 * 決済履歴
 */
@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'wallet.id' })
  @ApiProperty({ example: 1 })
  wallet_id: number;

  @Column('int8', { nullable: true, comment: 'purchase.id' })
  @ApiProperty({ example: 1 })
  purchase_id: number;

  @Column('int4')
  @ApiProperty({ example: 1000 })
  amount: number;

  @ManyToOne(() => Wallet)
  @JoinColumn([
    {
      name: 'wallet_id',
      referencedColumnName: 'id',
    },
  ])
  wallet: Wallet;

  @ManyToOne(() => Purchase)
  @JoinColumn([
    {
      name: 'purchase_id',
      referencedColumnName: 'id',
    },
  ])
  purchase: Purchase;

  @OneToOne(
    () => PaymentGmoAttribute,
    (payment_gmo_attribute) => payment_gmo_attribute.payment,
  )
  payment_gmo_attribute: PaymentGmoAttribute;
}
