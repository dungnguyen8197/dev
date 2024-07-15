import { ApiProperty } from '@nestjs/swagger';
import { Organization } from 'src/entity/organization.entity';
import { FindFinancialInstitutionResponse } from 'src/financial-institutions/dto/find.dto';

export class OrganizationDetailResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '運動大学' })
  name: string;

  @ApiProperty({ example: 1 })
  region_id: number;

  @ApiProperty({ example: '北海道' })
  region_name: string;

  @ApiProperty({ example: 'test@anyteam.jp' })
  email: string;

  @ApiProperty({ example: '123-4567' })
  postal_code: string;

  @ApiProperty({ example: 'Osakashi' })
  municipalities: string;

  @ApiProperty({ example: 'Osaka' })
  address: string;

  @ApiProperty({ example: 'Umeda Sky Building' })
  building_name: string;

  @ApiProperty({ example: '1234-5678-901' })
  telephone_number: string;

  @ApiProperty({ example: '0005' })
  bank_code: string;

  @ApiProperty({ example: '545' })
  branch_code: string;

  @ApiProperty()
  financial_institution: FindFinancialInstitutionResponse;

  @ApiProperty({ example: 1 })
  account_type_id: number;

  @ApiProperty({ example: '123' })
  account_number: string;

  @ApiProperty({ example: '1' })
  account_holder: string;

  @ApiProperty({ example: 'https://resource.anyteam.jp/icon-example.png' })
  icon: string;

  @ApiProperty({ example: 0 })
  status: number;

  constructor(
    organization: Organization,
    organizationIcon: string,
    financialInstitution: FindFinancialInstitutionResponse,
  ) {
    this.id = organization.id;
    this.name = organization.name;
    this.region_id = organization.region_id;
    this.region_name = organization.region.name;
    this.email = organization.email;
    this.postal_code = organization.postal_code;
    this.municipalities = organization.municipalities;
    this.address = organization.address;
    this.building_name = organization.building_name;
    this.telephone_number = organization.telephone_number;
    this.bank_code = organization.bank_code;
    this.branch_code = organization.branch_code;
    this.financial_institution = financialInstitution;
    this.account_type_id = organization.account_type_id;
    this.account_number = organization.account_number;
    this.account_holder = organization.account_holder;
    this.icon = organizationIcon;
    this.status = organization.status;
  }
}
