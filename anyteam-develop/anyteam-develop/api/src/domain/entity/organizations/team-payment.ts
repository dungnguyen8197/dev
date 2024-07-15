import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BirthdayVo } from '../../value-object/user/birthday';
import { NameVo } from '../../value-object/user/name';
import { PaymentItemEntity } from '../payment/payment-item';

export class TeamPayment {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: '遠藤啓太' })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ example: 32 })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  region_id: number;

  @ApiProperty({ example: '北海道' })
  @IsString()
  @IsNotEmpty()
  region_name: string;

  @ApiProperty({ example: 'サッカー部' })
  @IsString()
  @IsNotEmpty()
  team_name: string;

  @ApiProperty({ example: '2021/12/10' })
  @IsString()
  general_support_date: string;

  @ApiProperty({ example: 201000 })
  @IsNumber()
  general_support_amount: number;

  @ApiProperty({ example: '2021/12/10' })
  @IsString()
  subscription_support_date: string;

  @ApiProperty({ example: 201000 })
  @IsNumber()
  subscription_support_amount: number;

  constructor(
    user_id: number,
    user_firstname: string,
    user_lastname: string,
    birthday: Date,
    region_id: number,
    region_name: string,
    team_name: string,
    paymentItem: PaymentItemEntity,
  ) {
    const birthdayVo = new BirthdayVo(birthday);
    const nameVo = new NameVo(user_firstname, user_lastname);

    this.user_id = user_id;
    this.user_name = nameVo.getFullName();
    this.age = birthdayVo.getAge();
    this.region_id = region_id;
    this.region_name = region_name;
    this.team_name = team_name;
    this.general_support_date = paymentItem.getGeneralSupportDate();
    this.general_support_amount = paymentItem.getGeneralSupportAmount();
    this.subscription_support_date = paymentItem.getSubscriptionSupportDate();
    this.subscription_support_amount =
      paymentItem.getSubscriptionSupportAmount();
  }
}
