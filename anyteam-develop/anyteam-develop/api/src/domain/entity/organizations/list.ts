import { ApiProperty } from '@nestjs/swagger';
import { OrganizationEntity } from '../organization';

export class OrganizationList {
    @ApiProperty({ type: [OrganizationEntity] })
    list: OrganizationEntity[];

    @ApiProperty({ type: Number })
    total: number;

    constructor(list: OrganizationEntity[], total: number) {
        this.list = list;
        this.total = total;
    }
}
