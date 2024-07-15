import { ApiProperty } from '@nestjs/swagger';

export class GetListRequest {
  @ApiProperty({ example: 'all' })
  scope: string;
}

