import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorMessageEntity } from 'src/domain/entity/message/error-message';
import { UserProfileEntity } from 'src/domain/entity/user/profile';
import { UserThumbnailEntity } from 'src/domain/entity/user/thumbnail';
import { UserPaymentList } from 'src/domain/entity/user/payment-list';
import { UserCheckEmailRequest } from './dto/check-email.dto';
import { UserRegisterRequest } from './dto/register.dto';
import { PasswordRequest } from './dto/password.dto';
import { UserProfileRequest } from './dto/profile.dto';
import { GetWalletResponse, UpdateWalletRequest } from './dto/wallet';
import { UsersService } from './users.service';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { UserUpdateEmailRequest } from './dto/update-email.dto';
import { UserVerifyCodeRequest } from './dto/verify-code.dto';
import { GetUserPaymentListRequest } from './dto/payment-list.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ユーザー入力にて与えられたメールアドレスに対して会員登録URLを送信する
  @Post('api/v1/users/confirmation/email')
  @ApiOperation({
    tags: ['user'],
    summary: 'Check valid email address.',
    description: 'Send to email for check valid email address.',
  })
  @ApiCreatedResponse()
  @ApiConflictResponse({ type: ErrorMessageEntity })
  async checkEmail(@Body() req: UserCheckEmailRequest) {
    return await this.usersService.checkEmail(req);
  }

  @Post('api/v1/users/register')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/register',
    description: 'Register new user.',
  })
  async register(@Body() req: UserRegisterRequest) {
    return await this.usersService.register(req);
  }

  @Get('api/v1/users/me/profile')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/profile',
    description: 'Get user profile by access token.',
  })
  @UseGuards(AuthGuard('jwt')) // passport-jwt戦略の付与
  @ApiOkResponse({ type: UserProfileEntity })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async getProfile(
    @Request() req: { user: JwtPayload },
  ): Promise<UserProfileEntity> {
    return await this.usersService.getProfile(req.user);
  }

  @Patch('api/v1/users/me/profile')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/profile',
    description: 'Update user profile.',
  })
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Request() req: { user: JwtPayload },
    @Body() profileRequest: UserProfileRequest,
  ): Promise<void> {
    return await this.usersService.updateProfile(req.user, profileRequest);
  }

  @Put('api/v1/users/me/thumbnail')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/thumbnail',
    description: 'Insert or Update user thumbnail.',
  })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOkResponse({ type: UserThumbnailEntity })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async updateIcon(@UploadedFile() icon: Express.Multer.File) {
    return await this.usersService.updateIcon(icon);
  }

  @Post('api/v1/users/email-change-code')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/email-change-code',
    description: 'Request update email address.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async requestUpdateEmailAddress(
    @Body() userUpdateEmailRequest: UserUpdateEmailRequest,
    @Request() req: { user: JwtPayload },
  ) {
    return await this.usersService.requestUpdateEmailAddress(
      userUpdateEmailRequest,
      req.user,
    );
  }

  @Patch('api/v1/users/email')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/email',
    description: 'Check verify code and update email address.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async updateEmailAddress(
    @Body() userVerifyCodeRequest: UserVerifyCodeRequest,
    @Request() req: { user: JwtPayload },
  ) {
    return await this.usersService.updateEmailAddress(
      userVerifyCodeRequest,
      req.user,
    );
  }

  @Patch('api/v1/users/me/password')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/password',
    description: 'Update user password ',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async updatePassword(
    @Request() req: { user: JwtPayload },
    @Body() passwordRequest: PasswordRequest,
  ) {
    return this.usersService.updatePassword(req.user, passwordRequest);
  }

  @Get('api/v1/users/me/payments')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/payments',
    description: 'Get user payment history ',
  })
  @UseGuards(AuthGuard('jwt')) // passport-jwt戦略の付与
  @ApiOkResponse({ type: UserPaymentList })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async getPayments(
    @Request() req: { user: JwtPayload },
    @Query() userPaymentListRequest: GetUserPaymentListRequest,
  ) {
    return await this.usersService.getPayments(
      req.user,
      userPaymentListRequest,
    );
  }

  @Get('api/v1/users/me/wallet')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/wallet',
    description: 'Get user wallet ',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: GetWalletResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async getWallet(@Request() req: { user: JwtPayload }) {
    return await this.usersService.getWallet(req.user);
  }

  @Patch('api/v1/users/me/wallet')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/wallet',
    description: 'Upsert user wallet ',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async updateWallet(
    @Request() req: { user: JwtPayload },
    @Body() updateWalletRequest: UpdateWalletRequest,
  ) {
    return await this.usersService.updateWallet(req.user, updateWalletRequest);
  }

  @Patch('api/v1/users/me/withdrawal')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/withdrawal',
    description: 'User withdraw from this service.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async withdraw(@Request() req: { user: JwtPayload }): Promise<void> {
    return await this.usersService.withdraw(req.user);
  }

  @Patch('api/v1/users/me/purchases/:purchase_id/cancel')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/purchases/{purchase_id}/cancel',
    description: 'Cancel purchase (only subscription)',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async cancelPurchase(
    @Request() req: { user: JwtPayload },
    @Param('purchase_id', new ParseIntPipe()) purchase_id: number,
  ) {
    return await this.usersService.cancelPurchase(req.user, purchase_id);
  }

  @Get('api/v1/users/me/purchases/subscription/teams/:team_id/status')
  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/me/purchases/subscription/teams/{team_id}/status',
    description: 'Check active subscription of the team.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBadRequestResponse()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiNotFoundResponse()
  async isSubscribeTeam(
    @Request() req: { user: JwtPayload },
    @Param('team_id', new ParseIntPipe()) team_id: number,
  ) {
    const isSubscribeTeam = await this.usersService.isSubscribeTeam(
      req.user,
      team_id,
    );
    if (isSubscribeTeam) {
      return { status: HttpStatus.OK };
    } else {
      throw new NotFoundException();
    }
  }
}
