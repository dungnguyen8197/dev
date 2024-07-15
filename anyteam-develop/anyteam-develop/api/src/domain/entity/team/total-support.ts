import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AmountVo } from '../../value-object/payment-summary/amount';

export class TotalSupport {
  @ApiProperty({ example: 62400 })
  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @ApiProperty({ example: 62400 })
  @IsNumber()
  @IsNotEmpty()
  total_received_amount: number;

  constructor(amount: number) {
    const amountVo = new AmountVo(amount);

    this.total_amount = amountVo.getValue();
    this.total_received_amount = amountVo.getReceivedAmount();
  }
}
