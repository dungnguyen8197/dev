import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

/**
 * Region
 */
@Entity({ name: 'regions' })
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @Column('varchar', { length: 50 })
  @ApiProperty({ example: '北海道' })
  name: string;

  @Column('int4', { comment: 'region_group.id' })
  @ApiProperty({ example: 10 })
  region_group_id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @OneToMany(() => Organization, (organization) => organization.region)
  organizations: Organization[];
}
