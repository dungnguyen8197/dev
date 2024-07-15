import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveMemberGMOResponse {
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  MemberID: string;

  constructor(MemberID: string) {
    this.MemberID = MemberID;
  }
}
