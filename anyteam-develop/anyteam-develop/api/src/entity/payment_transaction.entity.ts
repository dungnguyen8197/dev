import { ApiProperty } from '@nestjs/swagger';
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
import { User } from './user.entity';

/**
 * 決済処理トランザクション管理
 */
@Entity({ name: 'payment_transactions' })
@Unique(['user_id'])
export class PaymentTransaction extends BaseEntity {
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

  @OneToOne(() => User)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user: User;
}
