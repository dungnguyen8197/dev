import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Supporter } from './supporter';

export class SupporterList {
  @ApiProperty({ type: [Supporter] })
  @IsArray()
  @IsNotEmpty()
  list: Supporter[];

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  constructor(list: Supporter[], total: number) {
    this.list = list;
    this.total = total;
  }
}
