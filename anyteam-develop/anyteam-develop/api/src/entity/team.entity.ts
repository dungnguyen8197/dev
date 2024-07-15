import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Competition } from './competition.entity';
import { Organization } from './organization.entity';
import { PurchaseTeamAttribute } from './purchase-team-attribute.entity';
import { PaymentSupportTeamSummary } from './payment-support-team-summary.entity';
import { PaymentTeamSummary } from './payment-team-summary.entity';

/**
 * チーム管理
 */
@Entity({ name: 'teams' })
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  /**
   * 非公開：0
   * 公開：1
   */
  @Column('int2')
  @ApiProperty()
  status: number;

  @Column('varchar', { length: 50 })
  @ApiProperty({ example: '運動大学アイスホッケー部' })
  name: string;

  @Column('int8', { comment: ' organizations.id' })
  @ApiProperty({ example: 10 })
  organization_id: number;

  @Column('int8', { comment: 'competitions.id' })
  @ApiProperty({ example: 10 })
  competition_id: number;

  @Column('boolean', { default: true })
  @ApiProperty({ example: true })
  enabled: boolean;

  /**
   * Competitionテーブルとのリレーション定義
   */
  @ManyToOne(() => Competition)
  @JoinColumn([
    {
      name: 'competition_id',
      referencedColumnName: 'id',
    },
  ])
  competition: Competition;

  /**
   * Organizationテーブルとのリレーション定義
   */
  @ManyToOne(() => Organization)
  @JoinColumn([
    {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
  ])
  organization: Organization;

  @OneToMany(
    () => PurchaseTeamAttribute,
    (purchase_team_attribute) => purchase_team_attribute.team,
    {
      nullable: true,
    },
  )
  purchase_team_attributes: PurchaseTeamAttribute[];

  @OneToMany(
    () => PaymentSupportTeamSummary,
    (payment_support_team_summaries) => payment_support_team_summaries,
    {
      nullable: true,
    },
  )
  payment_support_team_summaries: PaymentSupportTeamSummary[];

  @OneToMany(
    () => PaymentTeamSummary,
    (payment_team_summaries) => payment_team_summaries,
    {
      nullable: true,
    },
  )
  payment_team_summaries: PaymentTeamSummary[];
}
