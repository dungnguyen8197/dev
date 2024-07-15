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
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrganizationUser } from 'src/entity/organization-user.entity';
import { CurrentLoginUserResponse } from './dto/current-login-user.dto';
import { OrganizationUserList } from './dto/list.dto';
import {
  OrganizationUserLoginRequest,
  OrganizationUserLoginResponse,
} from './dto/organization-login.dto';
import { OrganizationUserCreateRequest } from './dto/organization-user-create.dto';
import { OrganizationUserFindResponse } from './dto/organization-user-find.dto';
import { OrganizationUserUpdateRequest } from './dto/organization-user-update.dto';
import { RolesGuard } from './guard/roles.guard';
import {
  JwtPayload,
  OrganizationUsersService,
} from './organization-users.service';

type PasswordOmitOrganizationUser = Omit<OrganizationUser, 'password'>;

@Controller()
export class OrganizationUsersController {
  constructor(
    private readonly organizationUsersService: OrganizationUsersService,
  ) {}

  @ApiOperation({
    tags: ['organization-user'],
    summary: '/api/v1/organization/login',
    description: 'Login Api for Organization User.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: OrganizationUserLoginResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @UseGuards(AuthGuard('local-organization-user'))
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/organization/login')
  login(
    @Body() req: OrganizationUserLoginRequest,
    @Request() strategyReq: { user: PasswordOmitOrganizationUser | null },
  ) {
    return this.organizationUsersService.login(strategyReq.user);
  }

  @UseGuards(AuthGuard('jwt-organization-user'), RolesGuard)
  @Post('/api/v1/organizations/:organization_id/organization-users')
  @ApiOperation({
    tags: ['organization-user'],
    summary: '/api/v1/organizations/{organization_id}/organization-users',
    description: 'Create Organization User.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiConflictResponse()
  async create(
    @Param('organization_id', new ParseIntPipe()) organization_id,
    @Body() req: OrganizationUserCreateRequest,
  ) {
    return this.organizationUsersService.create(req, organization_id);
  }

  @UseGuards(AuthGuard('jwt-organization-user'), RolesGuard)
  @Get('api/v1/organizations/:organization_id/organization-users')
  @ApiOperation({
    tags: ['organization-user'],
    summary: '/api/v1/organizations/{organization_id}/organization-users',
    description: 'Get list Organization User.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrganizationUserList })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async list(@Param('organization_id', new ParseIntPipe()) organization_id) {
    return this.organizationUsersService.getList(organization_id);
  }

  @UseGuards(AuthGuard('jwt-organization-user'), RolesGuard)
  @Get(
    'api/v1/organizations/:organization_id/organization-users/:organization_user_id',
  )
  @ApiOperation({
    tags: ['organization-user'],
    summary:
      '/api/v1/organizations/{organization_id}/organization-users/{organization_user_id}',
    description: 'Get Organization User.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrganizationUserFindResponse })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiForbiddenResponse()
  async find(
    @Param('organization_id', new ParseIntPipe()) organization_id,
    @Param('organization_user_id', new ParseIntPipe()) organization_user_id,
  ) {
    return this.organizationUsersService.find(
      organization_id,
      organization_user_id,
    );
  }

  @UseGuards(AuthGuard('jwt-organization-user'), RolesGuard)
  @Patch(
    'api/v1/organizations/:organization_id/organization-users/:organization_user_id',
  )
  @ApiOperation({
    tags: ['organization-user'],
    summary:
      '/api/v1/organizations/{organization_id}/organization-users/{organization_user_id}',
    description: 'Update Organization User.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiConflictResponse()
  async update(
    @Param('organization_id', new ParseIntPipe()) organization_id,
    @Param('organization_user_id', new ParseIntPipe()) organization_user_id,
    @Body() req: OrganizationUserUpdateRequest,
  ) {
    return this.organizationUsersService.update(
      req,
      organization_id,
      organization_user_id,
    );
  }

  @UseGuards(AuthGuard('jwt-organization-user'), RolesGuard)
  @Delete(
    'api/v1/organizations/:organization_id/organization-users/:organization_user_id',
  )
  @ApiOperation({
    tags: ['organization-user'],
    summary:
      '/api/v1/organizations/{organization_id}/organization-users/{organization_user_id}',
    description: 'Delete Organization User',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async delete(
    @Param('organization_id', new ParseIntPipe()) organization_id,
    @Param('organization_user_id', new ParseIntPipe()) organization_user_id,
  ) {
    return await this.organizationUsersService.delete(
      organization_id,
      organization_user_id,
    );
  }

  @UseGuards(AuthGuard('jwt-organization-user'))
  @Get('api/v1/organization/me')
  @ApiOperation({
    tags: ['organization-user'],
    summary: '/api/v1/organization/me',
    description: 'Get Organization login user',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CurrentLoginUserResponse })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async currentLoginUser(@Request() payload: { user: JwtPayload }) {
    return await this.organizationUsersService.currentLoginUser(payload.user);
  }
}
