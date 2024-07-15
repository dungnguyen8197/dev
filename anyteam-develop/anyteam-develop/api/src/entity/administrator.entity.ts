import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Administrator
 */
@Entity({ name: 'administrators' })
@Unique(['email'])
export class Administrator extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2021-07-01 00:00:00' })
  readonly updated_at: Date;

  @Column('varchar', { length: 50 })
  @ApiProperty()
  name: string;

  @Column('varchar', { length: 255 })
  @IsEmail()
  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @Column('varchar', { length: 100 })
  @ApiProperty({ example: 'pass' })
  password: string;
}
