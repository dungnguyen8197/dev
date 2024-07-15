import { ApiProperty } from '@nestjs/swagger';
import { RegionEntity } from '../region';

export class RegionGroup {
  @ApiProperty({ example: 1 })
  region_group_id: number;

  @ApiProperty({ example: '北海道' })
  name: string;

  @ApiProperty({ type: [RegionEntity] })
  list: RegionEntity[];

  constructor(region_group_id: number, name: string, list: RegionEntity[]) {
    this.region_group_id = region_group_id;
    this.name = name;
    this.list = list;
  }
}

export class RegionGroups {
  @ApiProperty({ type: [RegionGroup] })
  groups: RegionGroup[];

  constructor(groups: RegionGroup[]) {
    this.groups = groups;
  }
}
