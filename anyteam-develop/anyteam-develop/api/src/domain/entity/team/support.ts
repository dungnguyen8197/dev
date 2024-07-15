import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AmountVo } from '../../value-object/payment-summary/amount';

export class Support {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  team_id: number;

  @ApiProperty({ example: 'サッカー部' })
  @IsString()
  @IsNotEmpty()
  team_name: string;

  @ApiProperty({ example: 402000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  general_support_count: number;

  @ApiProperty({ example: 201000 })
  @IsNumber()
  @IsNotEmpty()
  general_support_amount: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  subscription_support_count: number;

  @ApiProperty({ example: 201000 })
  @IsNumber()
  @IsNotEmpty()
  subscription_support_amount: number;

  @ApiProperty({ example: 63000 })
  @IsNumber()
  @IsNotEmpty()
  received_amount: number;

  constructor(
    team_id,
    team_name,
    amount,
    general_support_count,
    general_support_amount,
    subscription_support_count,
    subscription_support_amount,
  ) {
    const amountVo = new AmountVo(amount);

    this.team_id = team_id;
    this.team_name = team_name;
    this.amount = amountVo.getValue();
    this.general_support_count = general_support_count;
    this.general_support_amount = general_support_amount;
    this.subscription_support_count = subscription_support_count;
    this.subscription_support_amount = subscription_support_amount;
    this.received_amount = amountVo.getReceivedAmount();
  }
}
