import * as moment from 'moment';

import { ApiProperty } from '@nestjs/swagger';

export class AdministratorEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'yamada' })
  name: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: '2021-12-01 13:00:00' })
  created_at: Date | string;

  constructor(
    id: number,
    name: string,
    email: string,
    created_at: Date | string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = moment(created_at).format('YYYY-MM-DD HH:mm:ss');
  }
}
