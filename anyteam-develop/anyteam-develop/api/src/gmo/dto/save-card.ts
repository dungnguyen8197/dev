import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveCardGMOResponse {
  @ApiProperty({ example: '411**********111' })
  @IsNotEmpty()
  CardNo: string;

  @ApiProperty({ example: '2a99662' })
  @IsNotEmpty()
  Forward: string;

  constructor(CardNo: string, Forward: string) {
    this.CardNo = CardNo;
    this.Forward = Forward;
  }
}
