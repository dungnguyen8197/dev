import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterGMOResponse {
  @ApiProperty({
    example: '3b987f54c8d289ab7085cce28b78c96beed0289ff4db0752f84c088ad41bb54b',
  })
  @IsNotEmpty()
  AccessID: string;

  @ApiProperty({
    example: 'b0c5918e53a65dbd77cb531a4729a4862adee91abf9314a10f92f95914cb631e',
  })
  @IsNotEmpty()
  AccessPass: string;

  constructor(AccessID: string, AccessPass: string) {
    this.AccessID = AccessID;
    this.AccessPass = AccessPass;
  }
}
