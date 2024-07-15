import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PasswordRequest {
  @ApiProperty({ example: '0123abcd', required: true })
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @ApiProperty({ example: '1234abce', required: true })
  @IsNotEmpty()
  @IsString()
  new_password: string;
}
