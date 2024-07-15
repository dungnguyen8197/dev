import { ApiProperty } from '@nestjs/swagger';

export class OrganizationIconEntity {
  @ApiProperty({
    example: 'test.png',
  })
  icon: string;

  constructor(icon: string) {
    this.icon = icon;
  }
}
