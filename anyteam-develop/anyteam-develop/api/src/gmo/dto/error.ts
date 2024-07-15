import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ErrorGMOResponse {
  @ApiProperty({ example: 'G02' })
  @IsNotEmpty()
  ErrCode: string;

  @ApiProperty({ example: '42G020000' })
  @IsNotEmpty()
  ErrInfo: string;

  constructor(ErrCode: string, ErrInfo: string) {
    this.ErrCode = ErrCode;
    this.ErrInfo = ErrInfo;
  }
}
