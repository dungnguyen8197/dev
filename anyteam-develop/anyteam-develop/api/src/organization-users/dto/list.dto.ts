import { ApiProperty } from '@nestjs/swagger';
import { OrganizationUserEntity } from 'src/domain/entity/organization-user';

export class GetListRequest {
  @ApiProperty({ default: 10, required: false })
  limit: number;
}

export class OrganizationUserList {
  @ApiProperty({ type: [OrganizationUserEntity] })
  list: OrganizationUserEntity[];

  constructor(list: OrganizationUserEntity[]) {
    this.list = list;
  }
}
