import bcrypt = require('bcrypt');
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/domain/value-object/access-token';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserLoginResponse } from './dto/user-login.dto';

type PasswordOmitUser = Omit<User, 'password'>;

export interface JwtPayload {
  userId: User['id'];
  email: User['email'];
}

/**
 * @description Passportではできない認証処理をするクラス
 */
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  // 会員を認証する
  async validateuser(email: User['email'], pass: User['password']): Promise<PasswordOmitUser | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(pass, user.password)) {
      // TODO: パスワード情報を外部に出さないようにする
      //const { password, ...result } = user;

      //return result;
      return user;
    }

    return null;
  }

  // jwtトークンを取得する
  async login(user: PasswordOmitUser|null): Promise<UserLoginResponse> {
    if (!user.id) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = { userId: user.id, email: user.email };
    const accessToken = new AccessToken(this.jwtService.sign(payload));
    return new UserLoginResponse(accessToken);
  }
}
