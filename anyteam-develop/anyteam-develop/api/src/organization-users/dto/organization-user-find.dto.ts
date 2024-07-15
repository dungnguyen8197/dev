import { ApiProperty } from '@nestjs/swagger';

export class OrganizationUserFindResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Name' })
  name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @ApiProperty({ example: 1 })
  role: number;

  constructor(id: number, name: string, email: string, role: number) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
