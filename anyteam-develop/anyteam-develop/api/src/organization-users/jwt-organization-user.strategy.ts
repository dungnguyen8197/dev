import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OrganizationUser } from 'src/entity/organization-user.entity';

export interface OrganizationUserJWTPayload {
  organizationUserId: OrganizationUser['id'],
  email: OrganizationUser['email'],
  organizationId: OrganizationUser['organization_id']
}

@Injectable()
export class JwtOrganizationUserStrategy extends PassportStrategy(Strategy, 'jwt-organization-user') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: OrganizationUserJWTPayload): Promise<OrganizationUserJWTPayload> {
    if (!payload.organizationUserId || !payload.email) {
      throw new UnauthorizedException();
    }
    return { organizationUserId: payload.organizationUserId, email: payload.email, organizationId: payload.organizationId };
  }
}