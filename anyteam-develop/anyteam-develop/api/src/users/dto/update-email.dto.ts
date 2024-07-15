import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateEmailRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
