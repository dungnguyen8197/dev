import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Payment } from './payment.entity';
import { PurchaseTeamAttribute } from './purchase-team-attribute.entity';
import { Reward } from './reward.entity';

/**
 * 購入情報
 */
@Entity({ name: 'purchases' })
export class Purchase extends BaseEntity {
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

  @Column('int2', { default: 1, comment: '0: invalid, 1: valid' })
  @ApiProperty({ example: 1 })
  status: number;

  @Column('int2', { comment: '1: pay as you go, 2: subscription' })
  @ApiProperty({ example: 1 })
  type: number;

  @Column('int4')
  @ApiProperty({ example: 1000 })
  amount: number;

  // TODO: 必要か検討
  @Column('timestamp')
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  purchased_at: Date;

  @Column('boolean', { default: true })
  @ApiProperty({ example: true })
  is_active: boolean;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user: User;

  @OneToMany(() => Payment, (payment) => payment.purchase)
  payments: Payment[];

  @OneToOne(
    () => PurchaseTeamAttribute,
    (purchase_team_attribute) => purchase_team_attribute.purchase,
    {
      nullable: true,
    },
  )
  purchase_team_attribute: PurchaseTeamAttribute;

  @OneToOne(() => Reward, (reward) => reward.purchase, {
    nullable: true,
  })
  reward: Reward;
}
