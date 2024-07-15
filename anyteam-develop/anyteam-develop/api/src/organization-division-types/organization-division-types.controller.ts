import { Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrganizationDivisionTypeList } from 'src/domain/entity/organization-division-type/list';
import { OrganizationDivisionTypesService } from './organization-division-types.service';

@Controller()
export class OrganizationDivisionTypesController {
  constructor(private readonly organizationDivisionTypeService: OrganizationDivisionTypesService) {}

  @Get('api/v1/organization-division-types')
  @ApiOperation({
    tags: ['organization-division-type'],
    summary: '/api/v1/organization-division-types',
    description: 'Get list organization division type.'
  })
  @ApiQuery({
    name: "organization-type",
    type: Number,
    description: "organization-type Optional",
    required: false
  })
  @ApiResponse({status: HttpStatus.OK, type: OrganizationDivisionTypeList})
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse()
  list(
    @Query('organization-type', new DefaultValuePipe(0), new ParseIntPipe()) organization_type: number,
  ) {
    return this.organizationDivisionTypeService.getList(organization_type);
  }
}
