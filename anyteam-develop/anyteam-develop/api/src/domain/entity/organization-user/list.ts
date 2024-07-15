import { ApiProperty } from '@nestjs/swagger';
import { OrganizationUserEntity } from '../organization-user';
import { TeamEntity } from '../team';

export class OrganizationUserList {
  @ApiProperty({ type: [OrganizationUserEntity] })
  list: OrganizationUserEntity[];

  constructor(list: OrganizationUserEntity[]) {
    this.list = list;
  }
}
