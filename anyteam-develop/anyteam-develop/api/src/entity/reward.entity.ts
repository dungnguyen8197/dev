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
import { Purchase } from './purchase.entity';

/**
 * リワード
 */
@Entity({ name: 'rewards' })
export class Reward extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'purchase.id' })
  @ApiProperty({ example: 1 })
  purchase_id: number;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'reward-20211224012345678.png' })
  filename: string;

  @OneToOne(() => Purchase)
  @JoinColumn([
    {
      name: 'purchase_id',
      referencedColumnName: 'id',
    },
  ])
  purchase: Purchase;
}
