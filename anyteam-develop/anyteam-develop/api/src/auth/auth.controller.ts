import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { AuthService } from './auth.service';
import { UserLoginRequest, UserLoginResponse } from './dto/user-login.dto';

type PasswordOmitUser = Omit<User, 'password'>;

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    tags: ['user'],
    summary: '/api/v1/users/login',
    description: 'Login Api for User.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserLoginResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @UseGuards(AuthGuard('local')) // passport-local戦略の付与
  @Post('api/v1/users/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() req: UserLoginRequest,
    @Request() strategyReq: { user: PasswordOmitUser | null },
  ) {
    return this.authService.login(strategyReq.user);
  }
}
