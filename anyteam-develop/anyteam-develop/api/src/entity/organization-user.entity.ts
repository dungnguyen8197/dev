import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
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
@Entity({ name: 'organization_users' })
export class OrganizationUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @Column('varchar', { length: 50 })
  @ApiProperty({ example: 'taro yamada' })
  name: string;

  @Column('varchar', { length: 255 })
  @IsEmail()
  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @Column('varchar', { length: 100 })
  @ApiProperty({ example: 'password' })
  password: string;

  @Column('int8', { comment: 'organizations.id' })
  @ApiProperty({ example: 1 })
  organization_id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('boolean', { default: false })
  @ApiProperty()
  is_temporary: boolean;

  @Column('int2', { default: 1, comment: '1: administrator, 2: read only' })
  @ApiProperty({ example: '1' })
  role: number;

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
}
