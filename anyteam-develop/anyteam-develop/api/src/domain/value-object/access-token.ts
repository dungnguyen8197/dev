import { ApiProperty } from '@nestjs/swagger';

export class AccessToken {
  @ApiProperty()
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
