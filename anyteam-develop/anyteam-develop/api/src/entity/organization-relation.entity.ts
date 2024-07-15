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
 * Organization user
 */
@Entity({ name: 'organization_relations' })
export class OrganizationRelation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'organizations.id' })
  @ApiProperty({ example: 1 })
  organization_id: number;

  @Column('int8', { comment: 'organizations.id' })
  @ApiProperty({ example: 1 })
  available_organization_id: number;

  @ManyToOne(() => Organization)
  @JoinColumn([
    {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
  ])
  organization: Organization;

  @ManyToOne(() => Organization)
  @JoinColumn([
    {
      name: 'available_organization_id',
      referencedColumnName: 'id',
    },
  ])
  available_organization: Organization;
}
