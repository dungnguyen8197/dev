import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class HealthCheckController {
  @Get('api/v1/health-check')
  @ApiOperation({
    tags: ['other'],
    summary: '/api/v1/health-check',
    description: 'API for Health check to use in ALB'
  })
  @ApiOkResponse({ type: String })
  index() {
    return 'This action returns health-check status:200';
  }
}
