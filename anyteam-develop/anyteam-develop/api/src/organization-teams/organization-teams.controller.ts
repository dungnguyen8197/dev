import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrganizationTeamList } from 'src/domain/entity/organization-team/list';
import { TeamEntity } from 'src/domain/entity/team';
import { GetListRequest } from './dto/list.dto';
import { OrganizationTeamUpdateRequest } from './dto/organization-team-update.dto';
import { RoleUpdateGuard } from './guard/roles.guard';
import { JwtPayload } from 'src/organization-users/organization-users.service';
import { OrganizationTeamsService } from './organization-teams.service';

@Controller()
export class OrganizationTeamsController {
  constructor(
    private readonly organizationTeamsService: OrganizationTeamsService,
  ) {}

  @Get('api/v1/organizations/:organization_id/teams')
  @ApiOperation({
    tags: ['organization team'],
    summary: '/api/v1/organizations/{organization_id}/teams',
    description: 'Get organization team list.',
  })
  @ApiOkResponse({ type: OrganizationTeamList })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async list(
    @Query() req: GetListRequest,
    @Param('organization_id', new ParseIntPipe()) organization_id,
  ) {
    return await this.organizationTeamsService.getList(organization_id, req);
  }

  @UseGuards(AuthGuard('jwt-organization-user'), RoleUpdateGuard)
  @Put('api/v1/organizations/:organization_id/teams')
  @ApiOperation({
    tags: ['organization team'],
    summary: '/api/v1/organizations/{organization_id}/teams',
    description: 'Create or update team',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TeamEntity })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async update(
    @Param('organization_id', new ParseIntPipe()) organization_id,
    @Body() req: OrganizationTeamUpdateRequest[],
  ) {
    return await this.organizationTeamsService.update(organization_id, req);
  }

  @UseGuards(AuthGuard('jwt-organization-user'), RoleUpdateGuard)
  @Delete('api/v1/organizations/:organization_id/teams')
  @ApiOperation({
    tags: ['organization team'],
    summary: '/api/v1/organizations/{organization_id}/teams',
    description: 'Delete team',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async delete(
    @Param('organization_id', new ParseIntPipe()) organization_id,
    @Body() req: number[],
  ) {
    return await this.organizationTeamsService.deleteOrganizationTeams(
      organization_id,
      req,
    );
  }
}
