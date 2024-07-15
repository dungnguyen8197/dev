import { ApiProperty } from '@nestjs/swagger';

export class GetUserPaymentListRequest {
  @ApiProperty({ default: 20, required: false })
  limit: number;

  @ApiProperty({ default: 0, required: false })
  offset: number;
}
