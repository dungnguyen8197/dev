import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Purchase } from './purchase.entity';
import { Team } from './team.entity';

/**
 * 購入詳細情報（チーム属性）
 */
@Entity({ name: 'purchase_team_attributes' })
export class PurchaseTeamAttribute extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8', { comment: 'purchase.id' })
  @ApiProperty({ example: 1 })
  purchase_id: number;

  @Column('int8', { comment: 'team.id' })
  @ApiProperty({ example: 1 })
  team_id: number;

  @OneToOne(() => Purchase)
  @JoinColumn([
    {
      name: 'purchase_id',
      referencedColumnName: 'id',
    },
  ])
  purchase: Purchase;

  @ManyToOne(() => Team)
  @JoinColumn([
    {
      name: 'team_id',
      referencedColumnName: 'id',
    },
  ])
  team: Team;
}
