import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentCompetitionSummary } from './payment-competition-summary.entity';

import { ApiProperty } from '@nestjs/swagger';

/**
 * Competitions
 */
@Entity({ name: 'competitions' })
export class Competition extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('varchar', { length: 50 })
  @ApiProperty({ example: 'アメリカンフットボール' })
  name: string;

  @OneToMany(
    () => PaymentCompetitionSummary,
    (payment_competition_summaries) => payment_competition_summaries,
    {
      nullable: true,
    },
  )
  payment_competition_summaries: PaymentCompetitionSummary[];
}
