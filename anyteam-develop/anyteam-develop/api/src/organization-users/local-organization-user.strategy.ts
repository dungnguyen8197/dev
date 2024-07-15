import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { OrganizationUser } from 'src/entity/organization-user.entity';
import { OrganizationUsersService } from './organization-users.service';

type PasswordOmitOrganizationUser = Omit<OrganizationUser, 'password'>;

@Injectable()
export class LocalOrganizationStrategy extends PassportStrategy(Strategy, 'local-organization-user') {
  constructor(private organizationUsersService: OrganizationUsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: OrganizationUser['email'], pass: OrganizationUser['password']): Promise<PasswordOmitOrganizationUser|Object> {
    const organizationUser = await this.organizationUsersService.validateOrganizationUser(email, pass);
    
    if (!organizationUser) {
      throw new UnauthorizedException();
    }
    return organizationUser;
  }
}