import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';

export class BirthdayVo {
  @ApiProperty()
  readonly value: Date;
  readonly age: number;

  constructor(value: Date) {
    this.value = value;
    this.age = this.calcAge(value);
  }

  getValue(): Date {
    return this.value;
  }

  getAge(): number {
    return this.age;
  }

  private calcAge(date: Date): number {
    return moment().diff(date, 'years');
  }
}
