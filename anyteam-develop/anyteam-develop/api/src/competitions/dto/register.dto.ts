import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AdminRegisterRequest {
  @ApiProperty({ example: '陸上' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
