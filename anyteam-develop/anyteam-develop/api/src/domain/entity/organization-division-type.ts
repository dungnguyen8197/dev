import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDivisionTypeEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: '大学' })
    name: string;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}