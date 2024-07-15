import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UserContactRequest {
  @ApiProperty({ example: 'test1@anyteam.jp' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '廃部になった部活について' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'お世話になっております。...' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
