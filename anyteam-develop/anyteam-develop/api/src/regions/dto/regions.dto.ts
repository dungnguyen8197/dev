import { ApiProperty } from '@nestjs/swagger';

export class GetListRequest {
    @ApiProperty({ default: 10, required: false, })
    limit: number;
    
    @ApiProperty({ default: 0, required: false })
    offset: number;
}