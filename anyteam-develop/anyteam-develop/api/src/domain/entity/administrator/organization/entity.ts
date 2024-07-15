import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { Organization } from 'src/entity/organization.entity';

export class AdminOrganizationEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '運動大学' })
  name: string;

  @ApiProperty({ example: '学校' })
  type_name: string;

  @ApiProperty({ example: '大学' })
  division_type_name: string;

  @ApiProperty({ example: '2021-12-01 13:00:00' })
  created_at: string;

  constructor(
    organization: Organization,
    type_name: string,
    division_type_name: string,
  ) {
    this.id = organization.id;
    this.name = organization.name;
    this.created_at = moment(organization.created_at).format('YYYY-MM-DD HH:mm:ss');
    this.division_type_name = division_type_name;
    this.type_name = organization.is_group ? type_name + ' / 団体' : type_name;
  }
}
