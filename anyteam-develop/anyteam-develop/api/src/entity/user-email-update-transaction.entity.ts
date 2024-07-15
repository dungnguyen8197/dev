import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

@Entity({ name: 'user_email_update_transactions' })
export class UserEmailUpdateTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('int8')
  @ApiProperty({ example: 1 })
  user_id: number;

  @Column('varchar', { length: 255 })
  @IsEmail()
  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @Column('varchar', { length: 6 })
  @ApiProperty({ example: '123456' })
  code: string;
}
