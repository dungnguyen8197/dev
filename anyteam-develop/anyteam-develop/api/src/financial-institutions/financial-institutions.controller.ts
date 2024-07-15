import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FinancialInstitutionsService } from './financial-institutions.service';
import {
  FindFinancialInstitutionRequest,
  FindFinancialInstitutionResponse,
} from './dto/find.dto';

@Controller()
export class FinancialInstitutionsController {
  constructor(
    private readonly financialInstitutionsService: FinancialInstitutionsService,
  ) {}

  @Get('/api/v1/financial-institutions')
  @ApiOperation({
    tags: ['financial-institutions'],
    summary: '/api/v1/financial-institutions',
    description: 'Get financial-institution name by bank_code.',
  })
  @ApiOkResponse({ type: FindFinancialInstitutionResponse })
  @ApiBadRequestResponse()
  async find(@Query() req: FindFinancialInstitutionRequest) {
    return this.financialInstitutionsService.findByCode(req);
  }
}
