import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RegionGroups } from 'src/domain/entity/region/group';
import { RegionsService } from './regions.service';

@Controller()
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get('api/v1/regions')
  @ApiOperation({
    tags: ['region'],
    summary: '/api/v1/regions',
    description: 'Get region list',
  })
  @ApiOkResponse({ type: RegionGroups })
  @ApiBadRequestResponse()
  async list(): Promise<RegionGroups> {
    return await this.regionsService.getList();
  }
}
