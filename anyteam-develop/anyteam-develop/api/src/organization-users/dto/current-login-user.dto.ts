import { ApiProperty } from '@nestjs/swagger';

export class CurrentLoginUserResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Name' })
  name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @ApiProperty({ example: 1 })
  role: number;

  @ApiProperty({ example: 1 })
  organization_id: number;

  @ApiProperty({ example: true })
  is_group_user: boolean;

  constructor(
    id: number,
    name: string,
    email: string,
    role: number,
    organization_id: number,
    is_group_user: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.organization_id = organization_id;
    this.is_group_user = is_group_user;
  }
}
