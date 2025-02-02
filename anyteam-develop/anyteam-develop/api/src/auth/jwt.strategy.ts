import { ExtractJwt, Strategy as BaseJwtStrategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/entity/user.entity';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  userId: User['id'];
  email: User['email'];
}

/**
 * @description JWTの認証処理を行うクラス
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Authorization bearerからトークンを読み込む関数を返す
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 有効期限を無視するかどうか
      ignoreExpiration: false,
      // envファイルから秘密鍵を渡す
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  /**
   * ここでPayloadを使ったバリデーション処理を実行できる
   * Payloadは、AuthService.login()で定義した値
   * @param payload
   * @returns
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return { userId: payload.userId, email: payload.email };
  }
}
