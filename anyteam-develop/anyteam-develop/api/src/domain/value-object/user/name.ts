import { ApiProperty } from '@nestjs/swagger';

export class NameVo {
  @ApiProperty()
  readonly firstname: string;
  readonly lastname: string;
  readonly full_name: string;

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.full_name = `${this.lastname} ${this.firstname}`;
  }

  getFirstName(): string {
    return this.firstname;
  }

  getLastName(): string {
    return this.lastname;
  }

  getFullName(): string {
    return this.full_name;
  }
}
