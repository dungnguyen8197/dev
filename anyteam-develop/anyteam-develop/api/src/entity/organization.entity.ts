import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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
import { OrganizationDivisionType } from './organization-division-type.entity';
import { OrganizationRelation } from './organization-relation.entity';
import { Region } from './region.entity';
import { Team } from './team.entity';
import { PaymentOrganizationSummary } from './payment-organization-summary.entity';
import { PaymentSupportOrganizationSummary } from './payment-support-organization-summary.entity';

/**
 * Organization
 */
@Entity({ name: 'organizations' })
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @Column('varchar', { length: 50 })
  @IsNotEmpty()
  @ApiProperty({ example: '運動大学' })
  name: string;

  @Column('varchar', { length: 50, nullable: true })
  @IsNotEmpty()
  @ApiProperty({ example: 'ウンドウツウシンシャ' })
  name_kana: string;

  @Column('int4')
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  name_line_id: number;

  @Column('int8', { comment: 'regions.id' })
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  region_id: number;

  @Column('int8', { comment: 'organization_division_types.id' })
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  division_type_id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int2', { default: 0 })
  @ApiProperty({ example: 0 })
  status: number;

  @Column('varchar', { length: 255, nullable: true })
  @ApiProperty()
  email: string;

  @Column('varchar', { length: 8, nullable: true })
  @ApiProperty({ example: '123-4567' })
  postal_code: string;

  @Column('varchar', { length: 255, nullable: true })
  @ApiProperty()
  municipalities: string;

  @Column('varchar', { length: 255, nullable: true })
  @ApiProperty()
  address: string;

  @Column('varchar', { length: 255, nullable: true })
  @ApiProperty()
  building_name: string;

  @Column('varchar', { length: 13, nullable: true })
  @ApiProperty()
  telephone_number: string;

  @Column('varchar', { length: 4, nullable: true })
  @ApiProperty()
  bank_code: string;

  @Column('varchar', { length: 3, nullable: true })
  @ApiProperty()
  branch_code: string;

  @Column('int4', { nullable: true })
  @ApiProperty()
  account_type_id: number;

  @Column('varchar', { length: 8, nullable: true })
  @ApiProperty()
  account_number: string;

  @Column('varchar', { length: 20, nullable: true })
  @ApiProperty()
  account_holder: string;

  @Column('varchar', { length: 255, nullable: true })
  @ApiProperty()
  icon: string;

  @Column('boolean', { default: false })
  @ApiProperty()
  is_group: boolean;

  /**
   * Regionテーブルとのリレーション定義
   */
  @ManyToOne(() => Region)
  @JoinColumn([
    {
      name: 'region_id',
      referencedColumnName: 'id',
    },
  ])
  region: Region;

  /**
   * OrganizationDivisionTypeテーブルとのリレーション定義
   */
  @ManyToOne(() => OrganizationDivisionType)
  @JoinColumn([
    {
      name: 'division_type_id',
      referencedColumnName: 'id',
    },
  ])
  organization_division_type: OrganizationDivisionType;

  /**
   * OrganizationTeamテーブルとのリレーション定義
   */
  @OneToMany(() => Team, (organizationTeams) => organizationTeams.organization)
  organization_teams: Team[];

  @OneToMany(
    () => PaymentOrganizationSummary,
    (payment_organization_summaries) => payment_organization_summaries,
    {
      nullable: true,
    },
  )
  payment_organization_summaries: PaymentOrganizationSummary[];

  @OneToMany(
    () => PaymentSupportOrganizationSummary,
    (payment_support_organization_summaries) =>
      payment_support_organization_summaries,
    {
      nullable: true,
    },
  )
  payment_support_organization_summaries: PaymentSupportOrganizationSummary[];

  @OneToMany(
    () => OrganizationRelation,
    (organization_relations) => organization_relations,
    {
      nullable: true,
    },
  )
  organization_relations: OrganizationRelation[];
}
