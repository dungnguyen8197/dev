import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Administrator } from 'src/entity/administrator.entity';
import { AdminService } from './admin.service';

type PasswordOmitAdmin = Omit<Administrator, 'password'>;

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'local-admin') {
  constructor(private adminService: AdminService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: Administrator['email'], pass: Administrator['password']): Promise<PasswordOmitAdmin|Object> {
    const admin = await this.adminService.validateAdmin(email, pass);
    
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}