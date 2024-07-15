import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrganizationDivisionTypeEntity } from 'src/domain/entity/organization-division-type';
import { OrganizationDetailResponse } from 'src/organizations/dto/organization-detail.dto';
import { OrganizationUpdateRequest } from './dto/organizations-update.dto';
import { OrganizationList } from 'src/domain/entity/organizations/list';
import { GetOrganizationsQuery } from './dto/organizations.dto';
import { GetOrganizationInfoResponse } from './dto/organization-info.dto';
import {
  GetOrganizationSupportRequest,
  GetOrganizationTotalSupportRequest,
  GetTeamSupportRequest,
  GetTeamTotalSupportRequest,
} from './dto/organization-support.dto';
import { GetOrganizationSupportersRequest } from './dto/organization-supporters.dto';
import { GetOrganizationTeamPaymentRequest } from './dto/organization-team-payment.dto';
import { RoleUpdateGuard } from './guard/role-update.guard';
import { RolesGuard } from './guard/roles.guard';
import { OrganizationsService } from './organizations.service';
import { AdminOrganizationList } from '../domain/entity/administrator/organization/list';
import {
  AdminGetOrganizationsQuery,
  AdminOrganizationDTO,
} from './dto/organization-admin.dto';
import { OrganizationIconEntity } from '../domain/entity/organizations/icon';
import { AdminOrganizationDetailEntity } from '../domain/entity/administrator/organization/detail';
import { SupportList as OrganizationSupportList } from '../domain/entity/organizations/support-list';
import { TotalSupport as OrganizationTotalSupport } from '../domain/entity/organizations/total-support';
import { SupportList as TeamSupportList } from '../domain/entity/team/support-list';
import { TotalSupport as TeamTotalSupport } from '../domain/entity/team/total-support';
import { SupporterList } from '../domain/entity/organizations/supporter-list';
import { TeamPaymentList } from '../domain/entity/organizations/team-payment-list';

@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('api/v1/organization/type/:type_id/divisions')
  @ApiOperation({
    tags: ['region'],
    summary: '/api/v1/organization/type/{type_id}/divisions',
    description: 'Get region list by organization type',
  })
  @ApiOkResponse({ type: OrganizationDivisionTypeEntity })
  @ApiBadRequestResponse()
  async listByDivisionType(
    @Param('type_id', new ParseIntPipe()) type_id: string,
  ) {
    return await this.organizationsService.getListDivisionByType(type_id);
  }

  @Get('api/v1/organizations')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations',
    description: 'Get organization list',
  })
  @ApiOkResponse({ type: OrganizationList })
  @ApiBadRequestResponse()
  async list(@Query() req: GetOrganizationsQuery) {
    return await this.organizationsService.getList(req);
  }

  @Get('/api/v1/organizations/support')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/support',
    description: 'Get organizations support',
  })
  @UseGuards(AuthGuard('jwt-organization-user'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OrganizationSupportList })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async getOrganizationSupports(@Query() req: GetOrganizationSupportRequest) {
    return this.organizationsService.getOrganizationSupports(req);
  }

  @Get('api/v1/organizations/:organization_id')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/{organization_id}',
    description: 'Get organization detail',
  })
  @UseGuards(AuthGuard('jwt-organization-user'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OrganizationDetailResponse })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async find(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
  ) {
    return await this.organizationsService.getDetailOrganization(
      organization_id,
    );
  }

  @Patch('api/v1/organizations/:organization_id')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/{organization_id}',
    description: 'Update organization',
  })
  @UseGuards(AuthGuard('jwt-organization-user'), RoleUpdateGuard)
  @UseInterceptors(FileInterceptor('icon'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async update(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
    @Body() req: OrganizationUpdateRequest,
    @UploadedFile() icon: Express.Multer.File,
  ) {
    return await this.organizationsService.update(organization_id, req, icon);
  }

  @Get('api/v1/organizations/:organization_id/information')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/{organization_id}/information',
    description: 'Get organization information',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetOrganizationInfoResponse })
  @ApiBadRequestResponse()
  async findInfo(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
  ) {
    return await this.organizationsService.getOrganization(organization_id);
  }

  @Get('/api/v1/organizations/support/total')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/support/total',
    description: 'Get organizations total support ',
  })
  @UseGuards(AuthGuard('jwt-organization-user'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OrganizationTotalSupport })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async getOrganizationSupportTotal(
    @Query() req: GetOrganizationTotalSupportRequest,
  ) {
    return this.organizationsService.getOrganizationSupportTotal(req);
  }

  @Get('/api/v1/organizations/:organization_id/teams/support')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/{organization_id}/teams/support',
    description: 'Get team support ',
  })
  @UseGuards(AuthGuard('jwt-organization-user'), RoleUpdateGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TeamSupportList })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async getTeamSupports(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
    @Query() req: GetTeamSupportRequest,
  ) {
    return this.organizationsService.getTeamSupports(organization_id, req);
  }

  @Get('/api/v1/organizations/:organization_id/teams/support/total')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/{organization_id}/teams/support/total',
    description: 'Get team total support',
  })
  @UseGuards(AuthGuard('jwt-organization-user'), RoleUpdateGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TeamTotalSupport })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async getTeamSupportTotal(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
    @Query() req: GetTeamTotalSupportRequest,
  ) {
    return this.organizationsService.getTeamSupportTotal(organization_id, req);
  }

  @Get('api/v1/organizations/:organization_id/supporters')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/{organization_id}/supporters',
    description: 'Get supporters',
  })
  @UseGuards(AuthGuard('jwt-organization-user'), RoleUpdateGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SupporterList })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async getSupporters(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
    @Query() req: GetOrganizationSupportersRequest,
  ) {
    return await this.organizationsService.getSupporters(req, organization_id);
  }

  @Get('api/v1/organizations/:organization_id/teams/:team_id/payments')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/organizations/{organization_id}/teams/{team_id}/payments',
    description: 'Get team payments',
  })
  @UseGuards(AuthGuard('jwt-organization-user'), RoleUpdateGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TeamPaymentList })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async getPayments(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
    @Param('team_id', new ParseIntPipe()) team_id: number,
    @Query() req: GetOrganizationTeamPaymentRequest,
  ) {}

  // Admin
  @Get('api/v1/admin/organizations/')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/admin/organizations/',
    description: 'Get organization list by admin',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @ApiOkResponse({ type: AdminOrganizationList })
  @ApiBadRequestResponse()
  async adminList(
    @Query() req: AdminGetOrganizationsQuery,
  ): Promise<AdminOrganizationList> {
    return await this.organizationsService.adminGetList(req);
  }

  @Post('api/v1/admin/organizations/icons/')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/admin/organizations/icons/',
    description: 'Upload organization icon by admin',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(FileInterceptor('icon'))
  @ApiOkResponse({ type: OrganizationIconEntity })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async adminUploadIcon(
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<OrganizationIconEntity> {
    return await this.organizationsService.uploadIcon(icon);
  }

  @Post('api/v1/admin/organizations/')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/admin/organizations/',
    description: 'Create organization by admin',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async adminCreate(@Body() req: AdminOrganizationDTO): Promise<void> {
    return await this.organizationsService.adminCreate(req);
  }

  @Get('api/v1/admin/organizations/:organization_id')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/admin/organizations/{organization_id}',
    description: 'Get organization detail by admin',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @ApiOkResponse({ type: AdminOrganizationDetailEntity })
  @ApiBadRequestResponse()
  async adminFindOne(
    @Param('organization_id', new ParseIntPipe()) organization_id: number,
  ): Promise<AdminOrganizationDetailEntity> {
    return await this.organizationsService.adminFindOne(organization_id);
  }

  @Put('api/v1/admin/organizations/:organization_id')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/admin/organizations/{organization_id}',
    description: 'Update organization by admin',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async adminUpdate(
    @Param('organization_id', new ParseIntPipe()) organization_id,
    @Body() req: AdminOrganizationDTO,
  ): Promise<void> {
    return await this.organizationsService.adminUpdate(organization_id, req);
  }

  @Delete('/api/v1/admin/organizations/:organization_id')
  @ApiOperation({
    tags: ['organization'],
    summary: '/api/v1/admin/organizations/{organization_id}',
    description: 'Delete organization by admin',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  async adminDelete(
    @Param('organization_id', new ParseIntPipe()) id: number,
  ): Promise<void> {
    return await this.organizationsService.adminDelete(id);
  }
}
