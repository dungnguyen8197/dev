import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterRequest {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
