import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Competition } from './competition.entity';

/**
 * 競技支援サマリ
 */
@Entity({ name: 'payment_competition_summaries' })
export class PaymentCompetitionSummary extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'competition.id' })
  @ApiProperty({ example: 1 })
  competition_id: number;

  @Column('int4', { comment: 'total amount to competition' })
  @ApiProperty({ example: 100000 })
  amount: number;

  @Column('int2', { comment: 'calculation year' })
  @ApiProperty({ example: 2022 })
  year: number;

  @Column('int2', { comment: 'calculation month' })
  @ApiProperty({ example: 9 })
  month: number;

  @ManyToOne(() => Competition)
  @JoinColumn([
    {
      name: 'competition_id',
      referencedColumnName: 'id',
    },
  ])
  competition: Competition;
}
