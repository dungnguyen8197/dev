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
import { Organization } from './organization.entity';

/**
 * 組織支援サマリ
 */
@Entity({ name: 'payment_organization_summaries' })
export class PaymentOrganizationSummary extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'organization.id' })
  @ApiProperty({ example: 1 })
  organization_id: number;

  @Column('int4', { comment: 'total amount to organization' })
  @ApiProperty({ example: 100000 })
  amount: number;

  @Column('int4', {
    default: 0,
    comment: 'general support count to organization',
  })
  @ApiProperty({ example: 20 })
  general_support_count: number;

  @Column('int4', {
    default: 0,
    comment: 'general support amount to organization',
  })
  @ApiProperty({ example: 50000 })
  general_support_amount: number;

  @Column('int4', {
    default: 0,
    comment: 'subscription support count to organization',
  })
  @ApiProperty({ example: 20 })
  subscription_support_count: number;

  @Column('int4', {
    default: 0,
    comment: 'subscription support amount to organization',
  })
  @ApiProperty({ example: 50000 })
  subscription_support_amount: number;

  @Column('int2', { comment: 'calculation year' })
  @ApiProperty({ example: 2022 })
  year: number;

  @Column('int2', { comment: 'calculation month' })
  @ApiProperty({ example: 9 })
  month: number;

  @ManyToOne(() => Organization)
  @JoinColumn([
    {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
  ])
  organization: Organization;
}
