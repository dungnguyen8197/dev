import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminEditRequest {
  @ApiProperty({ example: 'Taro' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  @IsString()
  email: string;

  @ApiProperty({ example: '123456', required: false })
  password: string;
}
