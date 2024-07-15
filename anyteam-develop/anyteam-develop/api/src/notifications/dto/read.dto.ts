import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class NotificationReadRequest {
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  notification_id: number;
}