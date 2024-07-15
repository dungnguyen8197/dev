import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDivisionTypeEntity } from '../organization-division-type';

export class OrganizationDivisionTypeList {
    @ApiProperty({ type: [OrganizationDivisionTypeEntity] })
    divisions: OrganizationDivisionTypeEntity[];

    constructor(divisions: OrganizationDivisionTypeEntity[]) {
        this.divisions = divisions;
    }
}
