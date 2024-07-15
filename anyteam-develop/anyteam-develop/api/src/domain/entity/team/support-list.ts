import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Support } from './support';

export class SupportList {
  @ApiProperty({ type: [Support] })
  @IsArray()
  @IsNotEmpty()
  list: Support[];

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  constructor(list: Support[], total: number) {
    this.list = list;
    this.total = total;
  }
}
