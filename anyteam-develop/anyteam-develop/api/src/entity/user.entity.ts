import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { CorporateProfile } from './corporate-profile.entity';
import { Wallet } from './wallet.entity';
import { Purchase } from './purchase.entity';
import { PaymentSupportOrganizationSummary } from './payment-support-organization-summary.entity';
import { PaymentSupportTeamSummary } from './payment-support-team-summary.entity';

/**
 * 会員管理
 */
@Entity({ name: 'users' })
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('varchar', { length: 255 })
  @ApiProperty()
  uid: string;

  @Column('varchar', { length: 255 })
  @IsEmail()
  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @Column('varchar', { length: 100 })
  @ApiProperty({ example: 'pass' })
  password: string;

  @Column('int2', { default: 1, comment: '1: individual, 2: corporate' })
  @ApiProperty({ example: '1' })
  type: number;

  @Column('boolean', { default: true })
  @ApiProperty({ example: true })
  is_active: boolean;

  @OneToOne(() => UserProfile, (user_profile) => user_profile.user, {
    nullable: true,
  })
  user_profile: UserProfile;

  @OneToOne(
    () => CorporateProfile,
    (corporate_profile) => corporate_profile.user,
    {
      nullable: true,
    },
  )
  corporate_profile: CorporateProfile;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    nullable: true,
  })
  wallet: Wallet;

  @OneToMany(() => Purchase, (purchase) => purchase.user, {
    nullable: true,
  })
  purchases: Purchase[];

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
    () => PaymentSupportTeamSummary,
    (payment_support_team_summaries) => payment_support_team_summaries,
    {
      nullable: true,
    },
  )
  payment_support_team_summaries: PaymentSupportTeamSummary[];
}
