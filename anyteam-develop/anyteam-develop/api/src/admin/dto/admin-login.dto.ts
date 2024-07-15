import { IsNotEmpty, IsString } from 'class-validator';

import { AccessToken } from 'src/domain/value-object/access-token';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginRequest {
  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'pass' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AdminLoginResponse {
  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' })
  access_token: string;

  constructor(access_token: AccessToken) {
    this.access_token = access_token.value;
  }
}
