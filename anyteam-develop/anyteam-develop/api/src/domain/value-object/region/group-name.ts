import { ApiProperty } from '@nestjs/swagger';

const regionGroups = [
  {
    id: 1,
    name: '北海道',
  },
  {
    id: 2,
    name: '東北',
  },
  {
    id: 3,
    name: '関東',
  },
  {
    id: 4,
    name: '中部',
  },
  {
    id: 5,
    name: '近畿',
  },
  {
    id: 6,
    name: '中国',
  },
  {
    id: 7,
    name: '四国',
  },
  {
    id: 8,
    name: '九州',
  },
];

export class RegionGroupNameVo {
  @ApiProperty()
  readonly name: string;

  constructor(id: number) {
    this.name = regionGroups.find((group) => group.id === id).name;
  }

  getName() {
    return this.name;
  }
}
