import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserVerifyCodeRequest {
  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
