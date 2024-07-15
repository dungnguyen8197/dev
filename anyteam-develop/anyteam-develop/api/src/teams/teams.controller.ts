import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OrganizationUserJWTPayload } from 'src/organization-users/jwt-organization-user.strategy';
import { TeamList } from '../domain/entity/team/list';
import { GetListRequest } from '../teams/dto/teams.dto';
import {
  FindTeamByNameRequest,
  FindTeamByNameResponse,
  FindTeamByIdResponse,
} from '../teams/dto/find.dto';
import { TeamRegisterRequest, TeamRegisterResponse } from './dto/register.dto';
import { TeamsService } from './teams.service';

@Controller()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(AuthGuard('jwt-organization-user'))
  @Post('api/v1/teams/register')
  @ApiOperation({
    tags: ['team'],
    summary: '/api/v1/teams/register',
    description: 'Register new team.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TeamRegisterResponse })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async register(
    @Request() payload: { user: OrganizationUserJWTPayload },
    @Body() req: TeamRegisterRequest,
  ) {
    return await this.teamsService.register(payload.user, req);
  }

  @Get('api/v1/teams')
  @ApiOperation({
    tags: ['team'],
    summary: '/api/v1/teams',
    description: 'Get team list.',
  })
  @ApiOkResponse({ type: TeamList })
  @ApiBadRequestResponse()
  async list(@Query() req: GetListRequest) {
    return await this.teamsService.getList(req);
  }

  // TODO: team profileではなく、team情報返した方がいい？
  @Post('api/v1/teams/find')
  @ApiOperation({
    tags: ['team'],
    summary: '/api/v1/teams/find',
    description: 'Find team profile list by name',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FindTeamByNameResponse })
  @ApiBadRequestResponse()
  async findByName(@Body() req: FindTeamByNameRequest) {
    return await this.teamsService.getListByName(req);
  }

  @Get('api/v1/teams/:team_id')
  @ApiOperation({
    tags: ['team'],
    summary: '/api/v1/teams/{team_id}',
    description: 'Get team list.',
  })
  @ApiOkResponse({ type: FindTeamByIdResponse })
  @ApiBadRequestResponse()
  async findById(@Param('team_id', new ParseIntPipe()) team_id: number) {
    return await this.teamsService.findById(team_id);
  }
}
