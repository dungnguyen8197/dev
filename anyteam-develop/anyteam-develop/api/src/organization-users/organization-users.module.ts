import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtOrganizationUserStrategy } from './jwt-organization-user.strategy';
import { LocalOrganizationStrategy } from './local-organization-user.strategy';
import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Organization } from 'src/entity/organization.entity';
import { OrganizationUser } from 'src/entity/organization-user.entity';
import { OrganizationUsersController } from './organization-users.controller';
import { OrganizationUsersService } from './organization-users.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationUser, Organization]),
    PassportModule,
    LoggerModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: '6000s',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    OrganizationUsersService,
    LocalOrganizationStrategy,
    JwtOrganizationUserStrategy,
    EmailService,
  ],
  controllers: [OrganizationUsersController],
})
export class OrganizationUsersModule {}
