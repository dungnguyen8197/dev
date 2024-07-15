import { ApiProperty } from '@nestjs/swagger';

export class RegionEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '北海道' })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
