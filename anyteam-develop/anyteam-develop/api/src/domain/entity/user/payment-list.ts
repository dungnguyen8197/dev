import { ApiProperty } from '@nestjs/swagger';
import { UserPaymentEntity } from '../user-payment';

export class UserPaymentList {
  @ApiProperty({ type: [UserPaymentEntity] })
  list: UserPaymentEntity[];

  @ApiProperty({ example: 100 })
  count: number;

  @ApiProperty({ example: 20 })
  offset: number;

  constructor(list: UserPaymentEntity[], count: number, offset: number) {
    this.list = list;
    this.count = count;
    this.offset = offset;
  }
}
