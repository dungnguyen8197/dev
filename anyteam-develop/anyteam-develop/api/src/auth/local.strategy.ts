import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseLocalStrategy } from 'passport-local';
import { User } from 'src/entity/user.entity';
import { AuthService } from './auth.service';

type PasswordOmitUser = Omit<User, 'password'>;

/**
 * @description emailとpasswordを使った認証処理を実装するクラス
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(BaseLocalStrategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: User['email'], pass: User['password']): Promise<PasswordOmitUser|Object> {
    const user = await this.authService.validateuser(email, pass);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}