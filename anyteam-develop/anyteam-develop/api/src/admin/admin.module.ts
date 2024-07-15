import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Administrator } from 'src/entity/administrator.entity';
import { ConfigService } from '@nestjs/config';
import { JwtAdminStrategy } from './jwt-admin.strategy';
import { JwtModule } from '@nestjs/jwt';
import { LocalAdminStrategy } from './local-admin.strategy';
import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([Administrator]),
    PassportModule,
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
  providers: [AdminService, LocalAdminStrategy, JwtAdminStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
