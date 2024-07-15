import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AmountVo } from '../../value-object/payment-summary/amount';

export class Support {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  organization_id: number;

  @ApiProperty({ example: '運動大学' })
  @IsString()
  @IsNotEmpty()
  organization_name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  region_id: number;

  @ApiProperty({ example: '北海道' })
  @IsString()
  @IsNotEmpty()
  region_name: string;

  @ApiProperty({ example: 32, description: 'Team tied to the organization.' })
  @IsNumber()
  @IsNotEmpty()
  team_count: number;

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
  transaction_fee: number;

  constructor(
    organization_id: number,
    organization_name: string,
    region_id: number,
    region_name: string,
    team_count: number,
    amount: number,
    general_support_count: number,
    general_support_amount: number,
    subscription_support_count: number,
    subscription_support_amount: number,
  ) {
    const amountVo = new AmountVo(amount);

    this.organization_id = organization_id;
    this.organization_name = organization_name;
    this.region_id = region_id;
    this.region_name = region_name;
    this.team_count = team_count;
    this.amount = amountVo.getValue();
    this.general_support_count = general_support_count;
    this.general_support_amount = general_support_amount;
    this.subscription_support_count = subscription_support_count;
    this.subscription_support_amount = subscription_support_amount;
    this.transaction_fee = amountVo.getTransactionFee();
  }
}
