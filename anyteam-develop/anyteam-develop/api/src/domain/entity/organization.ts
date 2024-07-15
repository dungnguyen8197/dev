import { ApiProperty } from '@nestjs/swagger';
import { OrganizationIconVo } from '../value-object/organization/icon';

export class OrganizationEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '運動大学' })
  name: string;

  @ApiProperty({
    example: 'https://resource.anyteam.jp/img2021022411242795793500.png',
  })
  icon: string;

  @ApiProperty({ example: 1 })
  region_id: number;

  @ApiProperty({ example: '運動大学' })
  region_name: string;

  constructor(
    id: number,
    name: string,
    icon: string,
    region_id: number,
    region_name: string,
  ) {
    const iconVo = new OrganizationIconVo(icon);

    this.id = id;
    this.name = name;
    this.icon = iconVo.getUrl();
    this.region_id = region_id;
    this.region_name = region_name;
  }
}
