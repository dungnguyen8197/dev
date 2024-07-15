import { ApiProperty } from '@nestjs/swagger';
import { ErrorGMOResponse } from './error';
import { IsNotEmpty } from 'class-validator';

export class PaymentGMOResponse {
  @ApiProperty({ example: '77a5b328a65b841e91efa83848bf1e49' })
  AccessID: string;

  @ApiProperty({ example: '3497baaa54c6f84925d4d447286a8809' })
  AccessPass: string;

  @ApiProperty({ example: '0000000' })
  Approve: string;

  @ApiProperty({ example: '2202071102111111111111817073' })
  TranID: string;

  @ApiProperty({ example: '20210201101010' })
  TranDate: string;

  @ApiProperty({ example: '2a99662' })
  Forward: string;

  @ApiProperty({ example: '{"ErrCode":"E01","ErrInfo":"E01240002"}' })
  @IsNotEmpty()
  ErrorGMO: any;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  IsSuccess: boolean;

  constructor(
    IsSuccess: boolean,
    ErrorGMO: ErrorGMOResponse,
    AccessID?: string,
    AccessPass?: string,
    Approve?: string,
    TranID?: string,
    TranDate?: string,
    Forward?: string,
  ) {
    this.AccessID = AccessID;
    this.AccessPass = AccessPass;
    this.Approve = Approve;
    this.TranID = TranID;
    this.TranDate = TranDate;
    this.Forward = Forward;
    this.IsSuccess = IsSuccess;
    this.ErrorGMO = ErrorGMO;
  }
}
