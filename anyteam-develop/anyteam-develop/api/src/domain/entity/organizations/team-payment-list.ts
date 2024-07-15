import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { TeamPayment } from './team-payment';

export class TeamPaymentList {
  @ApiProperty({ type: [TeamPayment] })
  @IsArray()
  @IsNotEmpty()
  list: TeamPayment[];

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  constructor(list: TeamPayment[], total: number) {
    this.list = list;
    this.total = total;
  }
}
