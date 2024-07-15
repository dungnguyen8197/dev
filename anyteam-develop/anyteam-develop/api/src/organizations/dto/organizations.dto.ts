import { ApiProperty } from '@nestjs/swagger';

export class GetOrganizationsQuery {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  region_id: number;

  @ApiProperty({ required: false })
  organization_type: number;

  @ApiProperty({ required: false })
  name_line_id: number;

  @ApiProperty({ required: false })
  limit: number;

  @ApiProperty({ required: false })
  offset: number;

  @ApiProperty({ example: 'all' })
  scope: string;
}
