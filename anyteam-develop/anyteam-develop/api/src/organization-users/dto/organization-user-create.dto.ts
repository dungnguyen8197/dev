import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class OrganizationUserCreateRequest {
  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  role: number;
}
