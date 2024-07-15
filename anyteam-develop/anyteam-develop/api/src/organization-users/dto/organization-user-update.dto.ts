import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class OrganizationUserUpdateRequest {
  @ApiProperty({ example: 'anyteam' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'pass' })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  role: number;
}
