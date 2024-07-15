import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateCardGMOResponse {
  @ApiProperty({ example: 'at-1234567890123456' })
  @IsNotEmpty()
  OrderID: string;

  @ApiProperty({ example: '0823669' })
  @IsNotEmpty()
  Approve: string;

  @ApiProperty({ example: '2005021505111111111111806449' })
  @IsNotEmpty()
  TranID: string;

  @ApiProperty({ example: '20210201101010' })
  @IsNotEmpty()
  TranDate: string;

  constructor(
    OrderID: string,
    Approve: string,
    TranID: string,
    TranDate: string,
  ) {
    this.OrderID = OrderID;
    this.Approve = Approve;
    this.TranID = TranID;
    this.TranDate = TranDate;
  }
}

export class PurchaseValidateCardGMOResponse {
  @ApiProperty({ example: '0823669' })
  @IsNotEmpty()
  Approve: string;

  @ApiProperty({ example: '2a99662' })
  @IsNotEmpty()
  Forward: string;

  @ApiProperty({ example: '2005021505111111111111806449' })
  @IsNotEmpty()
  TranID: string;

  @ApiProperty({ example: '20210201101010' })
  @IsNotEmpty()
  TranDate: string;

  constructor(
    Approve: string,
    Forward: string,
    TranID: string,
    TranDate: string,
  ) {
    this.Forward = Forward;
    this.Approve = Approve;
    this.TranID = TranID;
    this.TranDate = TranDate;
  }
}
