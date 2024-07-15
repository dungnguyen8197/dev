import { ApiProperty } from '@nestjs/swagger';
import { Organization } from 'src/entity/organization.entity';

export class AdminOrganizationDetailEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  name_line_id: number;

  @ApiProperty({ example: 1 })
  division_type_id: number;

  @ApiProperty({ example: '運動通信大学' })
  name: string;

  @ApiProperty({ example: 1 })
  region_id: number;

  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @ApiProperty({ example: '目黒区' })
  municipalities: string;

  @ApiProperty({ example: '駒場1-1-1' })
  address: string;

  @ApiProperty({ example: '風間ビル4階' })
  building_name: string;

  @ApiProperty({ example: '1234-5678-901' })
  telephone_number: string;

  @ApiProperty({ example: '1234' })
  bank_code: string;

  @ApiProperty({ example: '123' })
  branch_code: string;

  @ApiProperty({ example: 1 })
  account_type_id: number;

  @ApiProperty({ example: '1234567' })
  account_number: string;

  @ApiProperty({ example: 'エンドウケイタ' })
  account_holder: string;

  @ApiProperty({ example: 'https://resource.anyteam.jp/icon-example.png' })
  icon: string | null;

  @ApiProperty({ example: 0 })
  status: number;

  @ApiProperty({ example: false })
  is_group: boolean;

  constructor(organization: Organization, iconUrl: string | null) {
    this.id = organization.id;
    this.division_type_id = organization.division_type_id;
    this.name = organization.name;
    this.name_line_id = organization.name_line_id;
    this.email = organization.email;
    this.region_id = organization.region_id;
    this.municipalities = organization.municipalities;
    this.address = organization.address;
    this.building_name = organization.building_name;
    this.telephone_number = organization.telephone_number;
    this.bank_code = organization.bank_code;
    this.branch_code = organization.branch_code;
    this.account_type_id = organization.account_type_id;
    this.account_number = organization.account_number;
    this.account_holder = organization.account_holder;
    this.icon = iconUrl;
    this.status = organization.status;
    this.is_group = organization.is_group;
  }
}
