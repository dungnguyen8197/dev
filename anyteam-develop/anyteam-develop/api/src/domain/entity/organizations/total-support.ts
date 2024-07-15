import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AmountVo } from '../../value-object/payment-summary/amount';

export class TotalSupport {
  @ApiProperty({ example: 62400 })
  @IsNumber()
  @IsNotEmpty()
  total_organization_count: number;

  @ApiProperty({ example: 62400 })
  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @ApiProperty({ example: 62400 })
  @IsNumber()
  @IsNotEmpty()
  total_transaction_fee: number;

  constructor(organization_count: number, amount: number) {
    const amountVo = new AmountVo(amount);

    this.total_organization_count = organization_count;
    this.total_amount = amountVo.getValue();
    this.total_transaction_fee = amountVo.getTransactionFee();
  }
}
