import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetWalletResponse {
  @ApiProperty({ example: '411**********111' })
  @IsNotEmpty()
  card_no: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  payment_method: number;

  @ApiProperty({ example: '2021' })
  @IsNotEmpty()
  expiration_year: string;

  @ApiProperty({ example: '06' })
  @IsNotEmpty()
  expiration_month: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  enabled: boolean;

  constructor(
    card_no: string,
    payment_method: number,
    expiration_year: string,
    expiration_month: string,
    enabled: boolean,
  ) {
    this.card_no = card_no;
    this.payment_method = payment_method;
    this.expiration_year = expiration_year;
    this.expiration_month = expiration_month;
    this.enabled = enabled;
  }
}

export class UpdateWalletRequest {
  @ApiProperty({ example: '411**********111' })
  @IsNotEmpty()
  card_no: string;

  @ApiProperty({ example: '2021' })
  @IsNotEmpty()
  expiration_year: string;

  @ApiProperty({ example: '06' })
  @IsNotEmpty()
  expiration_month: string;

  @ApiProperty({
    example: '3b987f54c8d289ab7085cce28b78c96beed0289ff4db0752f84c088ad41bb54b',
  })
  @IsNotEmpty()
  exec_tran_token: string;

  @ApiProperty({
    example: 'b0c5918e53a65dbd77cb531a4729a4862adee91abf9314a10f92f95914cb631e',
  })
  @IsNotEmpty()
  save_card_token: string;
}
