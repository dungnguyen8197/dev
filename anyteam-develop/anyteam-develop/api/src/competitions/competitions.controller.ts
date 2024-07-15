import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AdminGetListRequest, CompetitionsList } from './dto/list.dto';
import { CompetitionsService } from './competitions.service';
import { AdminRegisterRequest } from './dto/register.dto';
import { AdminUpdateRequest } from './dto/update.dto';
import { AdminGetCompetitionEntity } from 'src/domain/entity/competition';

@Controller()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @ApiOperation({
    tags: ['competitions'],
    summary: '/api/v1/competitions',
    description: 'Get list competitions',
  })
  @ApiResponse({ status: HttpStatus.OK, type: CompetitionsList })
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/competitions')
  list() {
    return this.competitionsService.getList();
  }

  @ApiOperation({
    tags: ['competitions'],
    summary: '/api/v1/admin/competitions',
    description: 'Admin get list competitions',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @ApiResponse({ status: HttpStatus.OK, type: CompetitionsList })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @Get('api/v1/admin/competitions')
  adminGetList(@Query() req: AdminGetListRequest) {
    return this.competitionsService.adminGetList(req);
  }

  @ApiOperation({
    tags: ['competitions'],
    summary: '/api/v1/admin/competitions',
    description: 'Admin create competitions',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Post('api/v1/admin/competitions')
  adminRegister(@Body() req: AdminRegisterRequest) {
    return this.competitionsService.adminRegister(req);
  }

  @ApiOperation({
    tags: ['competitions'],
    summary: '/api/v1/admin/competitions/{competition_id}',
    description: 'Admin update competitions',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Patch('api/v1/admin/competitions/:competition_id')
  adminUpdate(
    @Body() req: AdminUpdateRequest,
    @Param('competition_id', new ParseIntPipe()) competition_id,
  ) {
    return this.competitionsService.adminUpdate(req, competition_id);
  }

  @ApiOperation({
    tags: ['competitions'],
    summary: '/api/v1/admin/competitions/{competition_id}',
    description: 'Admin get competition detail.',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @ApiResponse({ status: HttpStatus.OK, type: AdminGetCompetitionEntity })
  @ApiUnauthorizedResponse()
  @Get('api/v1/admin/competitions/:competition_id')
  adminGetDetail(@Param('competition_id', new ParseIntPipe()) competition_id) {
    return this.competitionsService.adminGetDetail(competition_id);
  }

  @ApiOperation({
    tags: ['competitions'],
    summary: '/api/v1/admin/competitions/{competition_id}',
    description: 'Admin delete competitions',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Delete('api/v1/admin/competitions/:competition_id')
  adminDelete(@Param('competition_id', new ParseIntPipe()) competition_id) {
    return this.competitionsService.adminDelete(competition_id);
  }
}
