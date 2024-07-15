import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminRegisterRequest } from './dto/register.dto';
import { Administrator } from 'src/entity/administrator.entity';
import { AdminLoginRequest, AdminLoginResponse } from './dto/admin-login.dto';
import { GetListRequest } from './dto/list.dto';
import { AdministratorList } from 'src/domain/entity/administrator/list';
import { AdminEditRequest } from './dto/admin-edit.dto';

type PasswordOmitAdmin = Omit<Administrator, 'password'>;

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    tags: ['admin'],
    summary: '/api/v1/admin/login',
    description: 'Login Api for Admin.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: AdminLoginResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @UseGuards(AuthGuard('local-admin'))
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/admin/login')
  login(
    @Body() req: AdminLoginRequest,
    @Request() strategyReq: { user: PasswordOmitAdmin | null },
  ) {
    return this.adminService.login(strategyReq.user);
  }

  @ApiOperation({
    tags: ['admin'],
    summary: '/api/v1/admin/status',
    description: 'Check Login status for Admin',
  })
  @UseGuards(AuthGuard('jwt-admin'))
  @Get('api/v1/admin/status')
  status() {
    return true;
  }

  @UseGuards(AuthGuard('jwt-admin'))
  @Post('api/v1/admin/administrators')
  @ApiOperation({
    tags: ['admin'],
    summary: '/api/v1/admin/administrators',
    description: 'Register new administrators.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async store(@Body() req: AdminRegisterRequest) {
    return await this.adminService.store(req);
  }

  @UseGuards(AuthGuard('jwt-admin'))
  @Get('api/v1/admin/administrators')
  @ApiOperation({
    tags: ['admin'],
    summary: '/api/v1/admin/administrators',
    description: 'Get administrators list.',
  })
  @ApiOkResponse({ type: AdministratorList })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  async list(@Query() req: GetListRequest) {
    return await this.adminService.getList(req);
  }

  @UseGuards(AuthGuard('jwt-admin'))
  @Delete('api/v1/admin/administrators/:administrator_id')
  @ApiOperation({
    tags: ['admin'],
    summary: '/api/v1/admin/administrators/{administrator_id}',
    description: 'Delete administrators',
  })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse()
  async delete(
    @Param('administrator_id', new ParseIntPipe()) administrator_id,
  ) {
    return await this.adminService.delete(administrator_id);
  }

  @UseGuards(AuthGuard('jwt-admin'))
  @Put('api/v1/admin/administrators/:administrator_id')
  @ApiOperation({
    tags: ['admin'],
    summary: '/api/v1/admin/administrators/{administrator_id}',
    description: 'Update administrators',
  })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse()
  async edit(
    @Param('administrator_id', new ParseIntPipe()) administrator_id,
    @Body() req: AdminEditRequest,
  ) {
    return await this.adminService.update(req, administrator_id);
  }

  @UseGuards(AuthGuard('jwt-admin'))
  @Get('api/v1/admin/administrators/:administrator_id')
  @ApiOperation({
    tags: ['admin'],
    summary: '/api/v1/admin/administrators/{administrator_id}',
    description: 'Delete administrators',
  })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse()
  async findAdmin(
    @Param('administrator_id', new ParseIntPipe()) administrator_id,
  ) {
    return await this.adminService.findAdmin(administrator_id);
  }
}
