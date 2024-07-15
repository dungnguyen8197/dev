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
import { User } from './user.entity';
import { Team } from './team.entity';

/**
 * 支援者ベースチーム支援サマリ
 */
@Entity({ name: 'payment_support_team_summaries' })
export class PaymentSupportTeamSummary extends BaseEntity {
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

  @Column('int8', { comment: 'team.id' })
  @ApiProperty({ example: 1 })
  team_id: number;

  @Column('int4', { comment: 'total amount to team per user' })
  @ApiProperty({ example: 100000 })
  amount: number;

  @Column('int2', { comment: 'calculation year' })
  @ApiProperty({ example: 2022 })
  year: number;

  @Column('int2', { comment: 'calculation month' })
  @ApiProperty({ example: 9 })
  month: number;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user: User;

  @ManyToOne(() => Team)
  @JoinColumn([
    {
      name: 'team_id',
      referencedColumnName: 'id',
    },
  ])
  team: Team;
}
