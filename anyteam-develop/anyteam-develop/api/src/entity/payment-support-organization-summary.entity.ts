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
import { Organization } from './organization.entity';

/**
 * 支援者ベース組織支援サマリ
 */
@Entity({ name: 'payment_support_organization_summaries' })
export class PaymentSupportOrganizationSummary extends BaseEntity {
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

  @Column('int8', { comment: 'organization.id' })
  @ApiProperty({ example: 1 })
  organization_id: number;

  @Column('int4', { comment: 'total amount to organization per user' })
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

  @ManyToOne(() => Organization)
  @JoinColumn([
    {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
  ])
  organization: Organization;
}
