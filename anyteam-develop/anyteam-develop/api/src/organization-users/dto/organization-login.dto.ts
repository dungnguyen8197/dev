import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AccessToken } from 'src/domain/value-object/access-token';

export class OrganizationUserLoginRequest {
  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'pass' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class OrganizationUserLoginResponse {
  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' })
  access_token: string;

  @ApiProperty({ type: Boolean, example: false })
  is_temporary: boolean;

  constructor(access_token: AccessToken, is_temporary: boolean) {
    this.access_token = access_token.value;
    this.is_temporary = is_temporary;
  }
}
