import { ApiProperty } from '@nestjs/swagger';
import { RoleVo } from '../value-object/organization-user/role';

export class OrganizationUserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '運動大学' })
  name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @ApiProperty({ example: 1 })
  role: number;

  @ApiProperty({ example: '管理者' })
  role_label: string;

  constructor(id: number, name: string, email: string, role: number) {
    const roleVo = new RoleVo(role);

    this.id = id;
    this.name = name;
    this.email = email;
    this.role = roleVo.getValue();
    this.role_label = roleVo.getLabel();
  }
}
