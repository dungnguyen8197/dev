import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminRegisterRequest {
  @ApiProperty({ example: 'Taro' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
