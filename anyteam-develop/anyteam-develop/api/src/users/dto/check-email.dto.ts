import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCheckEmailRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}