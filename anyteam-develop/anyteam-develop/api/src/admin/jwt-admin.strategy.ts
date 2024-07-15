import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Administrator } from 'src/entity/administrator.entity';

interface JWTPayload {
  adminId: Administrator['id'],
  email: Administrator['email'],
  isAdmin: boolean,
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    return { adminId: payload.adminId, email: payload.email, isAdmin: payload.isAdmin };
  }
}